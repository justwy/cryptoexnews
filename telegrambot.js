const TelegramBot = require('node-telegram-bot-api');

const njtBusFetcher = require('./njtBusFetcher');
const nywFerryFetcher = require('./nywFerryFetcher');

const token = process.env.TOKEN

function runBot() {
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token,
    {
      polling: true
    }
  );
  // Matches "/bus [route_id]"
  bot.onText(/\/show (.*)/, async (msg, match) => {

    const chatId = msg.chat.id;

    const what = match[1];

    if (what == 'bus') {
      await njtBusFetcher.fetch();

      // send back the matched "whatever" to the chat
      bot.sendPhoto(chatId, '/tmp/cryptoexnews/bus.png', {
        caption: "I'm a bot!"
      }).catch((error) => {
        console.log(error);  // => 'ETELEGRAM'
        });
    } else if (what == 'ferry') {
      const chatId = msg.chat.id;

      await nywFerryFetcher.fetch();

      // send back the matched "whatever" to the chat
      bot.sendPhoto(chatId, '/tmp/cryptoexnews/ferry.png', {
        caption: "I'm a bot!"
      }).catch((error) => {
        console.log(error);  // => 'ETELEGRAM'
      });
    }
  })


  bot.onText(/\/bus/, async (msg, match) => {
    const chatId = msg.chat.id;
    await njtBusFetcher.fetch();

    bot.sendPhoto(chatId, '/tmp/cryptoexnews/bus.png', {
      caption: "I'm a bot!"
    }).catch((error) => {
      console.log(error);  // => 'ETELEGRAM'
    });
  });

  bot.onText(/\/ferry/, async (msg, match) => {
    const chatId = msg.chat.id;
    await nywFerryFetcher.fetch();

    // send back the matched "whatever" to the chat
    bot.sendPhoto(chatId, '/tmp/cryptoexnews/ferry.png', {
      caption: "I'm a bot!"
    }).catch((error) => {
      console.log(error);  // => 'ETELEGRAM'
    });

  });
}

module.exports = {
  runBot: runBot
}