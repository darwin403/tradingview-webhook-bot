const { Setting } = require("@/models/index");
const { safeSettings } = require("@/utils/index");

export default async (req, res) => {
  // Update Setting
  if (req.method === "PATCH") {
    let query_update = {};
    if (req.body.data) query_update["data"] = req.body.data;
    if ("enabled" in req.body) query_update["enabled"] = req.body.enabled;

    let query_find = { where: { type: req.query.type } };

    return Setting.update(query_update, query_find)
      .then(() => Setting.findAll())
      .then((settings) => safeSettings(settings))
      .then(res.json)
      .catch(res.next);
  }

  // Delete Setting
  if (req.method === "DELETE") {
    return Setting.destroy({ where: { type: req.query.type } })
      .then(() => Setting.findAll())
      .then((settings) => safeSettings(settings))
      .then(res.json)
      .catch(res.next);
  }
};
