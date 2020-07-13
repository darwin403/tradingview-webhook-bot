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
    storage: "db.sqlite",
    logging: false,
  });
}

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

/**
 * A function to generate default rows.
 */
async function defaultRows() {
  // Default Settings
  await Setting.findOrCreate({
    where: {
      type: "bot",
      data: "1168684731:AAGTIMDpHujIesW3sJLYcvcHh5FP-HGorTI",
    },
  });
  await Setting.findOrCreate({ where: { type: "screenshot", data: "1D" } });
  await Setting.findOrCreate({ where: { type: "template", data: "default" } });

  // Default Message
  await Message.findOrCreate({
    where: {
      data: "SPX Crossing 3185.04 This is an initial sample message!",
      agent: "PostmanRuntime/7.13.0",
      channels: "@skdtradingviewbot",
    },
  });
}

module.exports = { sequelize, Setting, Message, defaultRows };
