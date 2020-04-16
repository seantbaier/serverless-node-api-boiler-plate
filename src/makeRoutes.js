import userRouter from "./routes/user";
import userAuthRouter from "./routes/user/auth";

import {
  isUserAuthenticated,
  isUserAuthenticatedOptional,
} from "./middleware/authorization";

const makeRoutes = (app) => {
  // public routes
  app.use("/public/v1/users", isUserAuthenticatedOptional, userRouter);

  // authenticated routes
  app.use("/auth/v1/users", isUserAuthenticated, userAuthRouter);
};

export default makeRoutes;
