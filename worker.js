const puppeteer = require("puppeteer");
const { Bot, Message } = require("./models");
const Telegram = require("telegraf/telegram");

async function screenshot(symbol) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://tradingview.com/");
  // await page.click("")
  // await page.type('#id', CREDS.username);
  // await page.type('#loginPw', CREDS.password);

  await browser.close();
}

screenshot();

async function start() {
  const bots = await Bot.findAll();
  const messages = await Message.findAll({ where: { status: "pending" } });

  messages.forEach((message) => {
    const channels = message.channels.split(",");
    channels.forEach((channel) => {
      const telegram = new Telegram(bots[0].token);
      telegram
        .sendMessage(channel, "WORKING OMG")
        .then((response) => {
          console.log(
            `${response.chat["title"]} (${response.chat["username"]}): Posted "${response.text}"`
          );
        })
        .catch(console.log);
    });
  });
}
