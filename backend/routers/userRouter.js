// router maker
const express = require("express");
// my controller
const UserController = require("../controllers/userController.js");
// guard
const Middleware = require("../middleware.js");
// 3rd party api
const Utils = require("../utils.js");
// my router
const userRouter = express.Router();

// endpoints
userRouter.get("/", UserController.get);
userRouter.put("/", UserController.put);
userRouter.patch("/", Utils.upload.single("image_url"), UserController.patch); // req.file need middleware
userRouter.delete("/", UserController.delete);
userRouter.get("/:id", UserController.getId);

// export
module.exports = userRouter;
