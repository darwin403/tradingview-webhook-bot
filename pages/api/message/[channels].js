const { Message } = require("../../../models");

export default async (req, res) => {
  if (req.method === "POST") {
    return Message.create({
      data: req.body,
      agent: req.headers["user-agent"],
      channels: req.query.channels
        .split(",")
        .map((c) => c.trim())
        .filter((i) => i)
        .join(","),
    })
      .then(res.json)
      .catch(res.json);
  }

  if (req.method === "DELETE") {
    return Message.destroy({ where: { id: req.query.channels } })
      .then(() =>
        Message.findAll({
          order: [["createdAt", "DESC"]],
        })
      )
      .then(res.json)
      .catch(res.json);
  }
};
