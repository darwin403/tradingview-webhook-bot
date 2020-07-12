const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/tmp/db.sqlite",
  logging: false,
});

const Bot = sequelize.define("Bot", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
    validate: {
      len: [46, 46],
    },
  },
});

const Message = sequelize.define("Message", {
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agent: {
    type: DataTypes.STRING,
  },
  channels: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: [["pending", "done"]],
    },
    defaultValue: "pending",
  },
});

module.exports = { sequelize, Bot, Message };
