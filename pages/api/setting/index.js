const { Setting } = require("@/models/index");
const { safeSettings } = require("@/utils/index");

export default async (req, res) => {
  // Get all Settings
  if (req.method === "GET") {
    return Setting.findAll()
      .then((settings) => safeSettings(settings))
      .then(res.json)
      .catch(res.next);
  }

  // Create Setting
  if (req.method === "POST") {
    return Setting.create({ type: req.body.type, data: req.body.data })
      .then(() => Setting.findAll())
      .then((settings) => safeSettings(settings))
      .then(res.json)
      .catch(res.next);
  }
};
