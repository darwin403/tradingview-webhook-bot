import Settings from "@/components/settings";

const { Message, Setting } = require("../../models");

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
    const worker = await Setting.findOne({ where: { type: "worker" } });

    return res.json({
      env: process.env.NODE_ENV === "production" ? "production" : "development",
      workerActivateAt: worker ? worker["data"] : null,
      database: process.env.DATABASE_URL ? "Heroku Postgres" : "SQLite3",
      messages: { total, pending, done },
    });
  }
};
