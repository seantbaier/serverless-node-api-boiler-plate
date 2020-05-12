import userRouter from "./routes/user";
import userAuthRouter from "./routes/user/auth";
import platformDataContractCheckReportAuthRouter from "./routes/platform-data-contract-check/auth";

import {
  isUserAuthenticated,
  isUserAuthenticatedOptional,
} from "./middleware/authorization";

const makeRoutes = (app) => {
  // public routes
  app.use("/public/v1/users", isUserAuthenticatedOptional, userRouter);

  // authenticated routes
  app.use("/auth/v1/users", isUserAuthenticated, userAuthRouter);
  app.use(
    "/auth/v1/salesforce/platform-data-contract-check",
    isUserAuthenticated,
    platformDataContractCheckReportAuthRouter
  );
};

export default makeRoutes;
