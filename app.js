// Setup basic express server
var express = require('express');
var request = require("request");
var feed = require("feed-read");
var bodyParser = require("body-parser");


var get_data = require("./data/get_data.js");
var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var server = require('http').createServer(app);
var port = process.env.PORT || 3000;


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
var results =[];
var resultSorted = [];
app.post('/stocks', function(req, res){
	var query = "https://news.google.com/news/feeds?q="+req.body.stockTicker+"&output=rss&num=50&scoring=n";
	feed(query, function(err, articles) { 
		if (err) {
			throw err;
		}	
		results = [];
		resultSorted = [];
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title;
			var date = articles[i].published;
			var description = articles[i].content.replace(/<(?:.|\n)*?>/gm, '');
			var url = articles[i].link;
			var sentiment = analyze(description); 
			var score = sentiment.score;
			results.push(new Article(title, date, description, url, score));
			resultSorted.push(new Article(title, date, description, url, score));
		}
		res.send(results);
	})
})
app.get("/sortStocks",function(req,res){
	sortResults("score",true);

	res.send(resultSorted);
})

app.post('/company', function(req, res) {
	var query = "http://api.glassdoor.com/api/api.htm?t.p=26106&t.k=g3q6WWopG8O&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=" + req.body.stockName;
	request(query, function(error, response, data) {
		if (error) {
			throw error;
		}
		var name = JSON.parse(data).response.employers[0].name;
		var ceo = JSON.parse(data).response.employers[0].ceo.name;
		var logo = JSON.parse(data).response.employers[0].squareLogo;
		var homePage = JSON.parse(data).response.employers[0].website;
		var company = new Glass(name, ceo, logo, homePage);
		res.send(company);
	});
})

app.post("/ceo", function(req, res) {
	var query = "https://news.google.com/news/feeds?q=" + req.body.ceoName + "&output=rss&num=50&scoring=n";
	feed(query, function(err, articles) {
		if (err) {
			throw err;
		}
		var result = [];
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title;
			var date = articles[i].published;
			var description = articles[i].content.replace(/<(?:.|\n)*?>/gm, '');
			var url = articles[i].link;
			var sentiment = analyze(description);
			var score = sentiment.score;
		}
		res.send(results);
	});
});
app.get("/sortCeo",function(req,res){
	sortResults("score",true);
	res.send(resultSorted);
})

function sortResults(prop, asc) {
    resultSorted = resultSorted.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
}

Article = function(title, date, description, url, score) {
	this.title = title;
	this.date = date;
	this.description = description;
	this.url = url;
	this.score = score;
}

Glass = function(name, ceo, logo, homePage) {
	this.name = name;
	this.ceo = ceo;
	this.logo = logo;
	this.homePage = homePage;
}

