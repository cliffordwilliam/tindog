const Helper = require("../helper.js");
const { User } = require("../models/index.js");
const Utils = require("../utils.js");
const fs = require("fs").promises;
const path = require("path");

module.exports = class UserController {
  static async post(req, res, next) {
    try {
      // get body
      const { name, email, password } = req.body;
      // POST
      const obj = await User.create({
        name,
        email,
        password,
        is_verified: false,
      });
      // res
      res.status(201).json({
        message: "User successfully created.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async loginEmail(req, res, next) {
    try {
      // get body
      let { email, password } = req.body;
      // null? ""
      email = email ?? "";
      password = password ?? "";
      // no user? throw
      const obj = await User.findOne({ where: { email } });
      if (!obj) {
        Helper.error(
          "User not found. Please check your email or register.",
          401
        );
      }
      // wrong password? throw
      if (!(await Helper.compare(password, obj.password))) {
        Helper.error("Wrong password. Please try again.", 401);
      }
      // payload (user ID) -> token
      const token = await Helper.sign(obj.id);
      // email btn link
      const frontendLink = `${process.env.FRONTEND_BASE_URL}/confirm-email/${token}`;
      // get html
      const htmlPath = path.join(
        __dirname,
        "../templates",
        "email-template.html"
      );
      let htmlContent = await fs.readFile(htmlPath, "utf8");
      // update html btn link
      htmlContent = htmlContent.replace("{{frontendLink}}", frontendLink);
      // send mail
      await Utils.transporter.sendMail({
        from: "ccliffordwilliam@gmail.com",
        to: obj.email,
        subject: "[Tindog] Email Verification",
        html: `
        ${htmlContent}
      `,
      });
      // res
      res.status(200).json({
        message: "Email verification successfully sent.",
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      // get body
      let { email, password } = req.body;
      // null? ""
      email = email ?? "";
      password = password ?? "";
      // no user? throw
      const obj = await User.findOne({ where: { email } });
      if (!obj) {
        Helper.error(
          "User not found. Please check your email or register.",
          401
        );
      }
      // wrong password? throw
      if (!(await Helper.compare(password, obj.password))) {
        Helper.error("Wrong password. Please try again.", 401);
      }
      // payload (user ID) -> token
      const token = await Helper.sign(obj.id);
      // res
      res.status(200).json({
        message: "User successfully logged in.",
        obj,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  static async get(req, res, next) {
    try {
      // get query
      let { limit, page, sort, sortBy, search, searchBy } = req.query; // .../?limit=10&page=1&
      const options = Helper.pagination(
        limit,
        page,
        sort,
        sortBy,
        search,
        searchBy,
        [
          "id",
          "name",
          "email",
          "password",
          "image_url",
          "is_verified",
          "createdAt",
          "updatedAt",
        ], // validSortFields (all cols)
        ["name", "email", "password", "image_url"] // validSearchFields (strings only)
      );
      // GET
      const total = await User.count();
      // GET
      const obj = await User.findAll(options);
      // res
      res.status(200).json({
        message: "Users successfully retrieved.",
        obj,
        total,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getId(req, res, next) {
    try {
      // get params
      let { id } = req.params;
      id = Math.max(parseInt(id, 10), 1) || 1; // default 1
      // GET
      const obj = await User.findByPk(+id); // .../:id
      // res
      res.status(200).json({
        message: "User successfully retrieved.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async put(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // get body
      let { name, password, is_verified } = req.body;
      // not nulls -> updateFields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (password) updateFields.password = await Helper.hash(password);
      if (is_verified) updateFields.is_verified = is_verified;
      // PUT
      const [_, [obj]] = await User.update(updateFields, {
        where: { id },
        returning: true,
      });
      // res
      res.status(200).json({
        message: "User successfully updated.",
        obj,
      });
    } catch (error) {
      next(error);
    }
  }
  static async patch(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // no file? throw - need middleware
      if (!req.file) {
        Helper.error("File is required.", 400);
      }
      // file -> 64
      const base64 = req.file.buffer.toString("base64");
      // 64 -> image_url & upload
      const result = await Utils.imagekit.upload({
        file: base64,
        fileName: req.file.originalname,
        tags: [`${req.file.originalname}`],
      });
      const image_url = result.url;
      // PATCH
      const [_, [obj]] = await User.update(
        { image_url },
        { where: { id }, returning: true }
      );
      // res
      res.status(200).json({
        message: "User image url successfully updated.",
        image_url,
      });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      // get loggedIn
      const { id } = req.loggedInUser.dataValues;
      // DELETE
      await User.destroy({ where: { id } });
      // res
      res.status(200).json({
        message: "User successfully deleted.",
      });
    } catch (error) {
      next(error);
    }
  }
};
