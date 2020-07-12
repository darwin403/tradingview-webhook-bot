const { Setting } = require("../../../models");

export default async (req, res) => {
  if (req.method === "PATCH") {
    let query_update = {};
    if (req.body.data) query_update["data"] = req.body.data;
    if (req.body.enabled) query_update["enabled"] = req.body.enabled;

    let query_find = { where: { type: req.query.type } };

    return Setting.update(query_update, query_find)
      .then(() => Setting.findAll())
      .then(res.json)
      .catch(res.json);
  }

  if (req.method === "DELETE") {
    return Setting.destroy({ where: { type: req.query.type } })
      .then(() => Setting.findAll())
      .then(res.json)
      .catch(res.json);
  }
};
