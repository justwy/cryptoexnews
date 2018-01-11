const Pageres = require('pageres');

const DELAY_IN_SEC = 2;

const busRouteCookie = {
    name: 'busroute',
    value: '158',
    domain: 'mybusnow.njtransit.com'
};

const mapCenterCookie = {
    name: 'mapcenter',
    value: '40.802705, -73.991331',
    domain: 'mybusnow.njtransit.com'
};

const zoom = {
    name: 'zoom',
    value: '12',
    domain: 'mybusnow.njtransit.com'
}

// return a promise of stream
function fetch() {
    return new Pageres({ delay: DELAY_IN_SEC, cookies: [busRouteCookie, mapCenterCookie, zoom], filename: 'bus' })
        .src('http://mybusnow.njtransit.com/bustime/map/displaymap.jsp', ['iPhone 6 Plus'], { crop: true })
        .dest('/tmp/cryptoexnews')
        .run();
}

module.exports = {
    fetch: fetch
};