const puppeteer = require("puppeteer-extra");
const { Bot, Message } = require("./models");
const Telegram = require("telegraf/telegram");
const { document } = require("telegraf/core/replicators");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function screenshot(page, symbol) {
  await page.goto(`https://www.tradingview.com/symbols/${symbol}/`);
  await page.waitForSelector('a[href*="/chart/?"]');

  const graph = await page.evaluate(
    () => document.querySelector('a[href*="/chart/?"]').href
  );
  await page.goto(graph);
  await page.waitForSelector(".item-3cgIlGYO");
  await page.evaluate(() => {
    document.querySelectorAll(".item-3cgIlGYO").forEach((tag) => {
      if (tag.textContent !== "All") return;

      tag.click();
    });
  });

  await page.waitForSelector("[class='chart-loading-screen']");
  await page.click("#header-toolbar-screenshot");
  await page.waitForSelector('[value*="https://www.tradingview.com/x/"]');

  const url = await page.evaluate(() => {
    return document.querySelector('[value*="https://www.tradingview.com/x/"]')
      .value;
  });

  return url;
}

async function begin() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-fullscreen", "--no-sandbox", "--window-size=1366,768"],
  });
  const page = (await browser.pages())[0];

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  const symbols = ["SPX", "GOOGL", "CL1!"];
  const telegram = new Telegram(
    "1168684731:AAGTIMDpHujIesW3sJLYcvcHh5FP-HGorTI"
  );

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    const image = await screenshot(page, symbol);

    telegram
      .sendPhoto("@skdtradingviewbot", image, {
        caption: `Update from: ${symbol}`,
      })
      .then((response) => {
        console.log(
          response.chat["title"],
          `(${response.chat["username"]}):`,
          response.text ? "Texted" : "Screenshot",
          `"${response.text || response.caption}"`
        );
      })
      .catch(console.log);
  }

  await browser.close();
}

begin();

async function start() {
  // const bots = await Bot.findAll();
  // const messages = await Message.findAll({ where: { status: "pending" } });
  // messages.forEach((message) => {
  //   const channels = message.channels.split(",");
  //   channels.forEach((channel) => {
  //   });
  // });
}

// start();
