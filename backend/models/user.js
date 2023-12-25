"use strict";
const { Model } = require("sequelize");
const Helper = require("../helper");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // required
        unique: { msg: "Name is already in use." }, // unique
        validate: {
          notNull: { msg: "Name is required." }, // required
          notEmpty: { msg: "Name cannot be empty." }, // required
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // required
        validate: {
          notNull: { msg: "Password is required." }, // required
          notEmpty: { msg: "Password cannot be empty." }, // required
        },
      },
      image_url: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "Invalid URL format." }, // isUrl
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (user) => {
    user.password = await Helper.hash(user.password);
  });
  return User;
};
