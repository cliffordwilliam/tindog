const Helper = require("../helper.js");
const { User } = require("../models/index.js");
const Utils = require("../utils.js");

module.exports = class UserController {
  static async post(req, res, next) {
    try {
      // get body
      const { name, password } = req.body;
      // POST
      const obj = await User.create({
        name,
        password,
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
  static async login(req, res, next) {
    try {
      // get body
      let { name, password } = req.body;
      // null? ""
      name = name ?? "";
      password = password ?? "";
      // no user? throw
      const obj = await User.findOne({ where: { name } });
      if (!obj) {
        Helper.error(
          "User not found. Please check your name or register.",
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
        token,
        obj,
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
        ["id", "name", "password", "image_url", "createdAt", "updatedAt"], // validSortFields (all cols)
        ["name", "password"] // validSearchFields (strings only)
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
      let { name, password } = req.body;
      // not nulls -> updateFields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (password) updateFields.password = await Helper.hash(password);
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
