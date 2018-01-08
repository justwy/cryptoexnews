const TOKEN = process.env.TOKEN
 
const BotFather = require('botfather')
const bf = new BotFather(TOKEN)

const request = require('request');

var cron = require('node-cron');

// number of times to send when new token is released.
const TOTAL_SENT_TIME = 6;

const TICKERS = ['enigma-project', 'appcoins', 'bounty0x', 'ethlend', 'stellar'];

var newList = '';
var sendTime = 0;

cron.schedule('*/5 * * * *', async function(){
    var tickerInfo = await Promise.all(TICKERS.map(ticker => getTicker(ticker)))
    var messages = tickerInfo.map(info => {

        info = JSON.parse(info)[0];

        return `*${info.symbol}\t\$${info.price_usd}*\t1h ${info.percent_change_1h}%\tmkt-cap ${info.market_cap_usd}`;
    })

    sendMessage(messages.join('\n'));
});

cron.schedule('*/10 * * * * *', async function(){
    getNewList((err, list) => {
        if (err) return console.error(err);

        if (list.length > 0 && list[0] != newList) {
            newList = list[0];
            sendTime = TOTAL_SENT_TIME;
        }

        if (sendTime > 0) {
            sendMessage(newList);
            sendTime--;
        }
    });

});

function getTicker(id) {
    return new Promise((resolve, reject) => {
        request.get("https://api.coinmarketcap.com/v1/ticker/" + id, (err, resp, body) => {
            if (err != null) return reject(err);

            return resolve(body);
        })
    })
}

function getNewList(cb) {
    binanceCrawler((err, xml) => {
        return parseNewListingXML(xml, cb);
    });
}

function parseNewListingXML(xml, cb) {
    var list = [];
    var found = false;

    var htmlparser = require("htmlparser2");
    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
            if (name === "a" && attribs.class === "article-list-link") {
                found = true
            }
        },
        ontext: function (text) {
            if (found) {
                list.push(text);
            }
        },
        onclosetag: function (tagname) {
            if (found) {
                found = !found;
            }
        }
    }, { decodeEntities: true });

    parser.write(xml);
    parser.end();

    return cb(null, list);
}

function binanceCrawler(cb) {
    request('https://support.binance.com/hc/en-us/sections/115000106672-New-Listings', function (error, response, body) {
        if (error) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            return cb(error);
        }

        return cb(null, body);
    });
}

function sendMessage(text) {
    bf.api('sendMessage', {
        chat_id: '@pubandsub',
        parse_mode: 'Markdown',
        text: text
    })
        .then(json => {
            if (json.ok) {
                return json.result
            }
            console.error(json.description)
        })
        .then(result => {
        })
        .catch(exception => {
            console.error(exception.stack)
        })
}