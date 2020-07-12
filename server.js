const express = require("express");
const next = require("next");

const { sequelize, Setting, Message } = require("./models");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Initialize Database
  await sequelize.sync();

  await Setting.findOrCreate({
    where: {
      type: "bot",
      data: "1168684731:AAGTIMDpHujIesW3sJLYcvcHh5FP-HGorTI",
    },
  });
  await Setting.findOrCreate({ where: { type: "screenshot", data: "1D" } });
  await Setting.findOrCreate({ where: { type: "template", data: "default" } });
  await Message.findOrCreate({
    where: {
      data: "This is an initial sample message!",
      agent: "PostmanRuntime/7.13.0",
      channels: "@mychannel",
    },
  });

  // Initialize Express
  const server = express();

  server.enable("trust proxy");

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
