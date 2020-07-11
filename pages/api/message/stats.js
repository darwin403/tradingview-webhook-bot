const { Message } = require("../../../models");

export default async (req, res) => {
  if (req.method === "GET") {
    const total = await Message.count();
    const pending = await Message.count({
      where: {
        status: "pending",
      },
    });

    const done = await Message.count({
      where: {
        status: "done",
      },
    });

    return res.json({ total, pending, done });
  }
};
