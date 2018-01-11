const TelegramBot = require('node-telegram-bot-api');

const screenshot = require('./screenshot');

const token = process.env.TOKEN

function runBusBot() {
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token,
    {
      polling: true
    }
  );
  // Matches "/bus [route_id]"
  bot.onText(/\/bus/, async msg => {

    const chatId = msg.chat.id;

    await screenshot.getBusStatus();

    // send back the matched "whatever" to the chat
    bot.sendPhoto(chatId, '/tmp/cryptoexnews/bus.png', {
      caption: "I'm a bot!"
    }).catch((error) => {
      console.log(error);  // => 'ETELEGRAM'
    });
  });
}

module.exports = {
  runBusBot: runBusBot
}