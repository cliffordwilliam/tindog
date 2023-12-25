const Helper = require("./helper.js");
const { User } = require("./models/index.js");

module.exports = class Middleware {
  static error(err, req, res, next) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }
    switch (err.name) {
      case "SequelizeValidationError":
      case "SequelizeUniqueConstraintError":
        return res.status(400).json({ message: err.errors[0].message });
      case "JsonWebTokenError":
        return res.status(401).json({ message: err.message });
      case "Error":
        return res.status(err.status).json({ message: err.message });
      default:
        return res.status(500).json({ message: "Internal Server Error." });
    }
  }
  static async tokenGuard(req, res, next) {
    try {
      // no token? throw
      if (!req.headers.authorization) {
        Helper.error("Unauthorized.", 401);
      }
      // get token
      const token = req.headers.authorization.split(" ")[1];
      // token -> payload
      const payload = Helper.verify(token);
      // no owner? throw
      const user = await User.findByPk(+payload);
      if (!user) {
        Helper.error("Unauthorized.", 401);
      }
      // save owner
      req.loggedInUser = { ...user };
      // move down
      next();
    } catch (error) {
      next(error);
    }
  }
};
