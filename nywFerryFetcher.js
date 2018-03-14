const Pageres = require('pageres');

const DELAY_IN_SEC = 5;

const mobileCookie = {
    name: 'smartbanner-closed',
    value: 'true',
    domain: 'www.marinetraffic.com'
};

const cookie2 = {
    name: 'vTo',
    value: '1',
    domain: '.marinetraffic.com'
}

// return a promise of stream
function fetch() {
    return new Pageres({ delay: DELAY_IN_SEC, cookies: [mobileCookie], filename: 'ferry' })
        .src('https://www.marinetraffic.com/en/ais/home/centerx:-73.992/centery:40.795/zoom:13', ['iPhone 6 Plus'], { crop: true })
        .dest('/tmp/cryptoexnews')
        .run();
}

fetch()

module.exports = {
    fetch: fetch
};