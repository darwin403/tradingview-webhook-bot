const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "public/db.sqlite",
  logging: false,
});

const Setting = sequelize.define("Setting", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  data: { type: DataTypes.STRING },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
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

module.exports = { sequelize, Setting, Message };
