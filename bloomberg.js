// Helper functions
function contains(array, object) {
    return (array.indexOf(object) != -1);
}

// Server of /pub folder
var express = require('express');
var app = express();
var bloomberg = require('./HistoricalData.js')

app.use(function(req, res, next) {
  console.log(req.method + '  ' + req.url);
  next();
});

app.listen(8765);

app.use('/', express.static(__dirname + '/'));

var symbols = ['GE']
var originalSymbolsLength = symbols.length
var data;
var stockNames = []
symbols.forEach(function(item) {
	stockNames.push(item + ' US Equity')
})
bloomberg.magic(stockNames, function(array) {
	data = array
	console.log(data)
})
app.get('/stocks', function(req, res) {
	if(!data) {
		var stockNames = []
		symbols.forEach(function(item) {
			stockNames.push(item + ' US Equity')
		})
		bloomberg.magic(stockNames, function(array) {
			data = array
			res.json(data)
		})
	}
	else {
		res.json(data)
	}	
})

// Call /stocks at least once before calling this method
app.get('/addSymbol', function(req,res) {
	if(!data) {
		res.end('Go to our main page to start the app')
	}
	else {
		var newSymbol = req.query.symbol || 'AAPL'
		if(!contains(symbols, newSymbol)) {
			var newStockName = newSymbol + ' US Equity'
			bloomberg.magic([newStockName], function(array) {
				if(array && array[0].name) {			
					symbols.push(newSymbol)
					data = data.concat(array)
					res.json(data)
				}
				else {
					console.log('Couldnt find stock')
					res.send(404)
				}
			})
		}
		else {
			res.json(data)
		}
	}
})

app.get('/destroy', function(req,res) {
	data = null;
	symbols = symbols.slice(0,originalSymbolsLength)
	res.send('OK')
})