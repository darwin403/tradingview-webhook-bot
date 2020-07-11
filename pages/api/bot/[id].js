const { Bot } = require("../../../models");

export default async (req, res) => {
  if (req.method === "DELETE") {
    return Bot.destroy({ where: { id: req.query.id } })
      .then(() => Bot.findAll())
      .then(res.json)
      .catch(res.json);
  }
};
