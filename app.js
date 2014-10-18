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

app.post('/stocks', function(req, res){
	var query = "https://news.google.com/news/feeds?q="+req.body.stockTicker+"&output=rss&num=100";
	feed(query, function(err, articles) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title;
			var date = articles[i].published;
			var description = articles[i].content.replace(/<(?:.|\n)*?>/gm, '');
			var url = articles[i].link;
			var sentiment = analyze(description); //Score: -6, Comparative:-1.5
			var score = sentiment.score;
			results.push(new Article(title, date, description, url, score));
		}
		res.send(results);
	})
})


app.get("/sortStocks",function(req,res){
	sortResults("score",true);
	res.send(results);
})


function sortResults(prop, asc) {
    results = results.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
    console.log(results);
}

Article = function(title, date, description, url, score) {
	this.title = title;
	this.date = date;
	this.description = description;
	this.url = url;
	this.score = score;
}