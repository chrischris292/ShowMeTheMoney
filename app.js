// Setup basic express server
var express = require('express');
var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.bodyParser());

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.post('/stocks', function(req, res){
	var stockTicker = req.body.stockTicker;
	console.log(stockTicker);
	res.send(stockTicker);
})


console.log(analyze("VentureBeatAMD announces layoffs and misses earnings targets in its first quarterly ...VentureBeatAdvanced Micro Devices reported earnings that missed Wall Street earnings targets, just a little more than a week after it appointed Lisa Su as the new chief executive in a surprise change. AMD's earnings are closely watched as a bellwether for low ...AMD Earnings Announcement A Disaster (AMD)Seeking Alpha (registration)AMD Q3 misses expectations: New CEO orders restructuring, global job losses ...ZDNetWill This Ratings Downgrade Hurt Advanced Micro Devices (AMD) Stock Today?TheStreet.comBusiness Insider -AnandTech -Investing.comall 247 news articles ")); //Score: -6, Comparative:-1.5

