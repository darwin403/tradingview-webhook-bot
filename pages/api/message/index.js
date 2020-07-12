const { Message } = require("../../../models");

export default async (req, res) => {
  if (req.method === "GET") {
    return Message.findAll({
      where: {
        status: "pending",
      },
      order: [["createdAt", "DESC"]],
    })
      .then(res.json)
      .catch(res.json);
  }
};
