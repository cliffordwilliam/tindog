// router maker
const express = require("express");
// guard
const Middleware = require("../middleware.js");
// bypass branch controller
const UserController = require("../controllers/userController");
// my router
const homeRouter = express.Router();
// child
const userRouter = require("./userRouter.js");

// free
homeRouter.post("/user", UserController.post);
homeRouter.post("/user/login", UserController.login);
homeRouter.post("/user/login-email", UserController.loginEmail);
homeRouter.post("/user/forgot-email", UserController.forgotEmail);
homeRouter.post("/user/google-login", UserController.googleLogin);
homeRouter.post("/user/captcha", UserController.captcha);
// token
homeRouter.use(Middleware.tokenGuard);
homeRouter.use("/user", userRouter);

// export
module.exports = homeRouter;
