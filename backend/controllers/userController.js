const Helper = require("../helper.js");
const { User } = require("../models/index.js");
const Utils = require("../utils.js");
const fs = require("fs").promises;
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const cheerio = require("cheerio");

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
  static async getAmazon(req, res, next) {
    // 27/12/2023 - working
    try {
      // get params
      let { search } = req.query; // .../?limit=10&page=1&
      // options
      const username = String(process.env.BRIGHT_DATA_USERNAME);
      const password = String(process.env.BRIGHT_DATA_PASSWORD);
      const port = 22225;
      const session_id = (1000000 * Math.random()) | 0;
      const options = {
        auth: {
          username: `${username}-session-${session_id}`,
          password,
        },
        host: "brd.superproxy.io",
        port,
        rejectUnauthorized: false,
      };
      // GET
      const response = await axios.get(search, options);
      // html page -> title, price, other scrapped data
      const $ = cheerio.load(response.data);
      const title = $("#productTitle").text().trim();
      const currentPrice = Helper.extractPrice(
        $(".priceToPay span.a-price-whole"),
        $(".a.size.base.a-color-price"),
        $(".a-button-selected .a-color-base")
      );
      const originalPrice = Helper.extractPrice(
        $("#priceblock_ourprice"),
        $(".a-price.a-text-price span.a-offscreen"),
        $("#listPrice"),
        $("#priceblock_dealprice"),
        $(".a-size-base.a-color-price")
      );
      const outOfStock =
        $("#availability span").text().trim().toLowerCase() ===
        "currently unavailable";
      const images =
        $("#imgBlkFront").attr("data-a-dynamic-image") ||
        $("#landingImage").attr("data-a-dynamic-image") ||
        "{}";
      const imageUrls = Object.keys(JSON.parse(images));
      const currency = Helper.extractCurrency($(".a-price-symbol"));
      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
      const description = Helper.extractDescription($);
      let stars = $(
        "a.a-popover-trigger.a-declarative span.a-size-base.a-color-base"
      )
        .text()
        .trim();
      stars = Helper.extractStars(stars);
      // res
      res.status(200).json({
        message: "Amazon successfully scrapped.",
        obj: {
          search,
          currency: currency || "$",
          image: imageUrls[0],
          title,
          currentPrice: Number(currentPrice) || Number(originalPrice),
          originalPrice: Number(originalPrice) || Number(currentPrice),
          discountRate: Number(discountRate),
          stars: stars,
          isOutOfStock: outOfStock,
          description,
          lowestPrice: Number(currentPrice) || Number(originalPrice),
          highestPrice: Number(originalPrice) || Number(currentPrice),
          averagePrice: Number(currentPrice) || Number(originalPrice),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async captcha(req, res, next) {
    try {
      // get body
      const { captchaValue } = req.body;
      // POST
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaValue}`
      );
      // res
      res.status(200).json({
        message: "Captcha successfully verified.",
        obj: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
  static async forgotEmail(req, res, next) {
    try {
      // get body
      let { email } = req.body;
      // null? ""
      email = email ?? "";
      // no user? throw
      const obj = await User.findOne({ where: { email } });
      if (!obj) {
        Helper.error(
          "User not found. Please check your email or register.",
          401
        );
      }
      // payload (user ID) -> token
      const token = await Helper.sign(obj.id);
      // email btn link
      const frontendLink = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;
      // get html
      const htmlPath = path.join(
        __dirname,
        "../templates",
        "forgot-email-template.html"
      );
      let htmlContent = await fs.readFile(htmlPath, "utf8");
      // update html btn link
      htmlContent = htmlContent.replace("{{frontendLink}}", frontendLink);
      // send mail
      await Utils.transporter.sendMail({
        from: "ccliffordwilliam@gmail.com",
        to: obj.email,
        subject: "[Tindog] Reset Password",
        html: `
        ${htmlContent}
      `,
      });
      // res
      res.status(200).json({
        message: "Reset password email successfully sent.",
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
  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.OAUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: {
          name: payload.name,
        },
        defaults: {
          name: payload.name,
          email: payload.email,
          password: "password_google",
        },
        hooks: false,
      });
      const access_token = Helper.sign(user.id);
      res.status(200).json({
        msg: `User successfully logged in.`,
        token: access_token,
      });
    } catch (error) {
      next(error);
    }
  }
};
