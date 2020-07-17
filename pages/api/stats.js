const { Message, Setting } = require("@/models/index");

export default async (req, res) => {
  if (req.method === "GET") {
    const total = await Message.count();
    const pending = await Message.count({
      where: {
        status: "pending",
      },
    });

    const success = await Message.count({
      where: {
        status: "success",
      },
    });

    const failed = await Message.count({
      where: {
        status: "failed",
      },
    });

    const worker = await Setting.findOne({ where: { type: "worker" } });

    return res.json({
      env: process.env.NODE_ENV === "production" ? "production" : "development",
      workerActivateAt: worker ? worker["data"] : null,
      database: process.env.DATABASE_URL ? "Heroku Postgres" : "SQLite3",
      messages: { total, pending, success, failed },
    });
  }
};
