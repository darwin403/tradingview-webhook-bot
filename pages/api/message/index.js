const { Message } = require("../../../models");

export default async (req, res) => {
  if (req.method === "GET") {
    return Message.findAll({
      where: {
        status: "pending",
      },
      order: [["createdAt", "DESC"]],
      limit: 100,
    })
      .then(res.json)
      .catch(res.json);
  }
};
