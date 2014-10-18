// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var blpapi = require('blpapi');
var session = new blpapi.Session({ host: '127.0.0.1', port: 8194 });

session.on('SessionStarted', function(m) {
    console.log("Session Started")
});


var securities = [
    { security: 'AAPL US Equity', correlation: 0, fields: ['LAST_TRADE'] },
    { security: 'GOOG US Equity', correlation: 1, fields: ['LAST_TRADE'] }
];

session.on('ServiceOpened', function(m) {
    if (m.correlations[0].value == service_id) {
        session.subscribe(securities);
    }
});

session.on('MarketDataEvents', function(m) {
    if (m.data.hasOwnProperty('LAST_TRADE')) {
        console.log(securities[m.correlations[0].value].security,
                    'LAST_TRADE', m.data.LAST_TRADE);
        // outputs:
        // AAPL US Equity LAST_TRADE 600.00
        // AAPL US Equity LAST_TRADE 601.00
        // GOOG US Equity LAST_TRADE 650.00
        // ...
    }
});
