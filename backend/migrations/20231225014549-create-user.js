"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // required
        unique: true, // unique
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // required
        unique: true, // unique
        validate: {
          isEmail: true, // isEmail
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // required
      },
      image_url: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true, // isUrl
        },
      },
      is_verified: {
        type: Sequelize.STRING,
        allowNull: false, // required
        defaultValue: false, // default value
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
