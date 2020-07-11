// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { Sequelize } = require("sequelize");

const connect = async function (req, res) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite",
  });

  try {
    await sequelize.authenticate();
    req.db = sequelize;
  } catch (err) {
    console.error(err);
  }
};

export default async (req, res) => {
  await connect(req, res);
  res.statusCode = 200;
  res.json({ nice: 101 });
};
