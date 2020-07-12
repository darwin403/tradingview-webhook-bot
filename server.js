const express = require("express");
const next = require("next");

const { sequelize, defaultRows } = require("./models");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Initialize Database
  await sequelize.sync();
  await defaultRows();

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
