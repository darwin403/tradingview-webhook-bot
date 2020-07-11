const { Bot } = require("../../../models");

export default async (req, res) => {
  if (req.method === "GET") {
    return Bot.findAll().then(res.json).catch(res.json);
  }

  if (req.method === "POST") {
    return Bot.create({ username: req.body.username, token: req.body.token })
      .then(() => Bot.findAll())
      .then(res.json)
      .catch(res.json);
  }
};
