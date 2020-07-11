const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const { sequelize } = require("./models");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || "3000";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Initialize Database
  await sequelize.sync();

  // Initialize Server
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
