// Setup basic express server
var express = require('express');
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
