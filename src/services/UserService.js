/* eslint-disable no-param-reassign */
import HttpStatus from "http-status-codes";
import { pick, isNil } from "lodash";

import User from "../models/user";
import { ApiError } from "../utils/errors";
import getLookupQuery from "../utils/getLookUpQuery";
import renameMongoDbFields from "../utils/results";
import { parseUrlOrUpload } from "../utils/request";

import {
  isLoggedIn,
  isPermittedToModifyUser,
} from "../middleware/authorization";
import * as AWS from "../utils/aws";

class UserService {
  getMany = async (req) => {
    const {
      query: { limit, sort },
    } = req;

    console.log("query: ", req.query);

    return User.find();
  };

  getOne = async (req) => {
    const {
      params: { id },
    } = req;

    const query = getLookupQuery(id);

    const users = await User.find(query);

    if (!users[0] || !users[0].isActive) {
      throw new ApiError({
        message: "404 User Not Found",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const user = users[0];
    return user;
  };

  create = async (req) => {
    const { body } = req;

    const data = await this.getDataFromBody(body);

    if (!isPermittedToModifyUser(req.user, data)) {
      throw new ApiError({
        message: "Not permitted to create this user",
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    if (!data.externalId) {
      // We do this here, because we don't want to risk storing the password in the
      // database. This way, we only look for it when we are creating a new user in
      // Cognito, and we only pass it into the call to create the user in Cognito.
      const cognitoUserData = {
        ...data,
        password: this.getPasswordFromBody(body),
      };

      const congnitoUser = await AWS.createUser(cognitoUserData);
      const sub = congnitoUser.User.Attributes.find(
        (attr) => attr.Name === "sub"
      );
      data.externalId = sub.Value;
    }

    const user = await User.create(data);
    await AWS.updateUser(user);
    return this.renameFields(user);
  };

  patch = async (req) => {
    const {
      params: { id },
      body,
    } = req;

    const query = getLookupQuery(id);
    const user = await User.findOne(query).exec();

    const { __v: currentVersion } = user;

    if (!isPermittedToModifyUser(req.user, user)) {
      throw new ApiError({
        message: "Not permitted to update this user",
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    const data = await this.getDataFromBody(body);
    data.__v = currentVersion + 1;

    // If we have an existing address and we're updating some portion of it,
    // make sure to merge the data so we don't lose any of the original data.
    if (data.address && user.address) {
      data.address = Object.assign(user.address, data.address);
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
    });

    await AWS.updateUser(updatedUser);
    return this.renameFields(updatedUser);
  };

  update = async (req) => {
    const {
      params: { id },
      body,
    } = req;

    const query = getLookupQuery(id);
    const user = await User.findOne(query).exec();

    if (!isPermittedToModifyUser(req.user, user)) {
      throw new ApiError({
        message: "Not permitted to update this user",
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    const { __v: currentVersion } = user;
    const { version } = body;

    if (isNil(version) || Number(version) !== currentVersion) {
      throw new ApiError({
        message: "409 Conflict",
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const data = await this.getDataFromBody(body);
    data.__v = currentVersion + 1;

    // Make sure we are not being asked to update the user's email address. It
    // it used as the username and therefore cannot be updated.
    if (user.email !== data.email) {
      throw new ApiError({
        message: "Not permitted to change email address",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
    });
    await AWS.updateUser(updatedUser);
    return this.renameFields(updatedUser);
  };

  delete = async (req) => {
    const {
      params: { id },
    } = req;

    const query = getLookupQuery(id);
    const user = await User.findOne(query).exec();

    if (!isPermittedToModifyUser(req.user, user)) {
      if (!user) {
        throw new ApiError({
          message: "404 User Not Found",
          statusCode: HttpStatus.NOT_FOUND,
        });
      } else {
        throw new ApiError({
          message: "Not permitted to delete this user",
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
    }

    await AWS.deleteUser(user);

    return await User.findByIdAndDelete(id);
  };

  renameFields = (data) => {
    const result = renameMongoDbFields(data);

    return result;
  };

  getPasswordFromBody = (body) => {
    const pwd = body.password;

    if (typeof pwd !== "undefined" || pwd !== null || pwd.trim() !== "") {
      return pwd;
    }

    return null;
  };

  getDataFromBody = async (body) => {
    const parsedBody = typeof body === "string" ? JSON.parse(body) : body;

    const data = pick(parsedBody, [
      "externalId",
      "email",
      "firstName",
      "lastName",
      "profilePic",
      "role",
      "isActive",
      "version",
    ]);

    if (typeof data.version !== "undefined") {
      data.__v = data.version;
      delete data.version;
    }

    if (typeof data.profilePic !== "undefined") {
      data.profilePicUrl = await parseUrlOrUpload(data.profilePic);
    }

    delete data.profilePic;

    return data;
  };
}

export default new UserService();
