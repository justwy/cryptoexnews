const Pageres = require('pageres');

const DELAY_IN_SEC = 2;

const mobileCookie = {
    name: 'mobile',
    value: 'false',
    domain: 'services.saucontds.com'
};

// return a promise of stream
function fetch() {
    return new Pageres({ delay: DELAY_IN_SEC, cookies: [mobileCookie], filename: 'ferry' })
        .src('https://services.saucontds.com/tds-map/nyw/routemapc.htm?id=1', ['1115x700'], { crop: true })
        .dest('/tmp/cryptoexnews')
        .run();
}

fetch()

module.exports = {
    fetch: fetch
};