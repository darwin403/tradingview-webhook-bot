export const safeSettings = (settings) => {
  // TODO: Ugly conversion
  return JSON.parse(JSON.stringify(settings)).map((setting) => {
    if (setting.type === "tradingview:credentials") {
      setting.data = setting.data.split(":")[0] + ":******";
    }
    return setting;
  });
};
