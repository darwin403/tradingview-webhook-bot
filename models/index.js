const { Sequelize, DataTypes } = require("sequelize");
let sequelize;

if (process.env.DATABASE_URL) {
  /**********************
   * HEROKU POSTGRES DB *
   **********************/
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });
} else {
  /******************
   * DEVELOPMENT DB *
   ******************/
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
  });
}

const Setting = sequelize.define("Setting", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  timeframe: { type: DataTypes.STRING },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: [["pending", "success", "failed"]],
    },
    defaultValue: "pending",
  },
  log: {
    type: DataTypes.STRING(10000),
  },
});

/**
 * A function to generate default rows.
 */
async function defaultRows() {
  // Default Settings
  await Setting.findOrCreate({
    where: { type: "telegram:bot" },
    defaults: { data: "1168684731:AAGTIMDpHujIesW3sJLYcvcHh5FP-HGorTI" },
  });
  await Setting.findOrCreate({
    where: { type: "tradingview:credentials" },
    defaults: { data: "skdcodes@gmail.com:welcome@123", enabled: false },
  });
  await Setting.findOrCreate({
    where: { type: "tradingview:screenshot" },
    defaults: { data: "1 day" },
  });

  // Default Message
  await Message.findOrCreate({
    where: {
      data: "SPX Crossing 3185.04 This is an initial sample message!",
      agent: "PostmanRuntime/7.13.0",
      channels: "@skdtradingviewbot",
      timeframe: "1 day",
    },
  });
}

module.exports = { sequelize, Setting, Message, defaultRows };
