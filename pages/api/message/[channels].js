const { Message } = require("@/models/index");

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
      timeframe: req.query.timeframe ? req.query.timeframe.trim() : null,
    })
      .then(res.json)
      .catch(res.json);
  }

  if (req.method === "DELETE") {
    return Message.destroy({ where: { id: req.query.channels } })
      .then(() =>
        Message.findAll({
          where: {
            status: "pending",
          },
          limit: 100,
          order: [["createdAt", "DESC"]],
        })
      )
      .then(res.json)
      .catch(res.json);
  }
};
