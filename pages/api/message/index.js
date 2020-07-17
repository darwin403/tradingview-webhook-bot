const { Message } = require("@/models/index");

export default async (req, res) => {
  // Get all Messages
  if (req.method === "GET") {
    return Message.findAll({
      where: {
        status: ["pending", "failed"]
      },
      order: [["createdAt", "DESC"]],
      limit: 100,
    })
      .then(res.json)
      .catch(res.next);
  }
};
