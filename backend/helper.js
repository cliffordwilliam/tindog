const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = class Helper {
  static error(message, status) {
    throw { name: "Error", message, status };
  }
  static async hash(value) {
    try {
      return await bycrypt.hash(value, 10);
    } catch (error) {
      throw error;
    }
  }
  static async compare(typedPassword, databasePassword) {
    try {
      return await bycrypt.compare(typedPassword, databasePassword);
    } catch (error) {
      throw error;
    }
  }
  static sign(value) {
    // payload -> token
    return jwt.sign(value, process.env.JWT_SECRET);
  }
  static verify(value) {
    // token -> payload
    return jwt.verify(value, process.env.JWT_SECRET);
  }
  static pagination(
    limit,
    page,
    sort,
    sortBy,
    search,
    searchBy,
    validSortFields,
    validSearchFields
  ) {
    limit = Math.max(parseInt(limit, 10), 1) || 10; // default 10
    page = Math.max(parseInt(page, 10), 1) || 1; // default 1
    sort = ["asc", "desc"].includes(sort) ? sort : "asc"; // default 'asc'
    sortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt"; // default 'createdAt'
    // limit offset order -> options
    const options = {
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sort]],
    };
    // search & search field? -> options
    if (search && searchBy) {
      searchBy = validSearchFields.includes(searchBy) ? searchBy : null;
      if (searchBy) {
        options.where = { [searchBy]: { [Op.like]: `%${search}%` } };
      }
    }
    return options;
  }
};
