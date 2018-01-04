const TOKEN = process.env.TOKEN
 
const BotFather = require('botfather')
const request = require('request')
const bf = new BotFather(TOKEN)

var cron = require('node-cron');

// number of times to send when new token is released.
const TOTAL_SENT_TIME = 6;

var newList = '';
var sendTime = 0;
 
cron.schedule('*/10 * * * * *', function(){
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
            console.info(result)
        })
        .catch(exception => {
            console.error(exception.stack)
        })
}