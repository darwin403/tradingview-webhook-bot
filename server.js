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

  // To retrieve HTTP protocol
  server.enable("trust proxy");

  // Routes
  server.all("*", (req, res, next) => {
    // Append next
    res.next = next;

    handle(req, res);
  });

  // Error Handler
  server.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json(err);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
