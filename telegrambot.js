const TelegramBot = require('node-telegram-bot-api');

const screenshot =  require('./screenshot');
 
const token = process.env.TOKEN
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
 
// Matches "/bus [route_id]"
bot.onText(/\/bus (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
 
  const chatId = msg.chat.id;
  //const busId = match[1] || "158"; // the captured "whatever"

  const stream = screenshot.fetchMap();
 
  // send back the matched "whatever" to the chat
  bot.sendAudio(chatId, stream);
});
