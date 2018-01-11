const fs = require('fs');
const screenshot = require('screenshot-stream');

const DELAY_IN_SEC = 1;

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

function fetchMap() {
    const stream = screenshot('http://mybusnow.njtransit.com/bustime/map/displaymap.jsp', '375x667', 
        { 
            crop: true, 
            delay: DELAY_IN_SEC, 
            cookies: [busRouteCookie, mapCenterCookie, zoom]
        }
    );

    return stream;
}

module.exports = fetchMap;