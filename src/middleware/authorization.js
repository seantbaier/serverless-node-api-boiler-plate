import { decode } from "jsonwebtoken";
import NodeCache from "node-cache";

import User from "../models/user";
import logger from "../utils/logger";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

const _str = (id) => {
  if (typeof id === "string") {
    return id;
  }

  return id.toHexString();
};

const verifyTokenAndGetUser = async (authHeader) => {
  const token = authHeader.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;

  let user = cache.get(token);
  if (user) {
    return Promise.resolve(user);
  }

  const data = decode(token);
  if (!data) {
    return Promise.reject();
  }

  user = await User.findOne({ externalId: data.sub });
  cache.set(token, user);

  return Promise.resolve(user);
};

const isUserAuthenticated = (req, res, next) => {
  if (
    !req.headers.authorization &&
    req.hostname &&
    req.hostname.includes("localhost")
  ) {
    // eslint-disable-next-line no-param-reassign
    req.user = { role: "System Administrator" };
    next();
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      status: 403,
      message: "FORBIDDEN",
    });
  }

  return (
    verifyTokenAndGetUser(authHeader)
      .then((data) => {
        // eslint-disable-next-line no-param-reassign
        req.user = data;
        next();

        return data;
      })
      // eslint-disable-next-line arrow-body-style
      .catch((err) => {
        logger.warn(err);
        return res.status(401).json({
          status: 401,
          message: "UNAUTHORIZED",
        });
      })
  );
};

const isUserAuthenticatedOptional = (req, res, next) => {
  if (
    !req.headers.authorization &&
    req.hostname &&
    req.hostname.includes("localhost")
  ) {
    // eslint-disable-next-line no-param-reassign
    req.user = { role: "System Administrator" };
    next();
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return null;
  }

  return (
    verifyTokenAndGetUser(authHeader)
      .then((data) => {
        // eslint-disable-next-line no-param-reassign
        req.user = data;
        next();

        return data;
      })
      // eslint-disable-next-line arrow-body-style
      .catch((err) => {
        logger.warn(err);
        next();
        return null;
      })
  );
};

const isAdminInternal = (req) => {
  if (!req.user && req.hostname && req.hostname.includes("localhost")) {
    return true;
  }

  return req.user.role === "System Administrator" || false;
};

// eslint-disable-next-line consistent-return
const isAdmin = (req, res, next) => {
  const isAdministrator = isAdminInternal(req);

  if (!isAdministrator) {
    return res.status(403).json({
      status: 403,
      message: "FORBIDDEN",
    });
  }

  next();
};

const isAdminOrUser = (req, id) =>
  isAdminInternal(req) ||
  _str(req.user._id) === _str(id) ||
  _str(req.user.externalId) === _str(id);

const isLoggedIn = (req) =>
  (!req.user && req.hostname && req.hostname.includes("localhost")) || req.user;

const isPermittedToModifyUser = (user, userToMod) => {
  if (!user || !userToMod || !user.role) {
    return false;
  }

  switch (user.role) {
    case "System Administrator":
      return true;
    default:
      return false;
  }
};

export {
  isUserAuthenticated,
  isUserAuthenticatedOptional,
  isAdmin,
  isAdminOrUser,
  isAdminInternal,
  isLoggedIn,
  isPermittedToModifyUser,
};
