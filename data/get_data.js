/* get_data.js
 * Parses the RSS feeds from Google Feed API for a given search query
 * 
 * Usage: node get_data.js > output.txt
 */

// Dependencies
var request = require("request");
var feed = require("feed-read");
var fs = require("fs");
// Adjust queries - do one at a time
var search = "tesla";
var results = [];

Article = function(title, date, description, url) {
	this.title = title;
	this.date = date;
	this.description = description;
	this.url = url;
}

module.exports.getData = function() {
	var query = "https://news.google.com/news/feeds?q=" + search + "&output=rss&num=2";
	feed(query, function(err, articles) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title;
			var date = articles[i].published;
			var description = articles[i].content.replace(/<(?:.|\n)*?>/gm, '');
			var url = articles[i].link;

			results.push(new Article(title, date, description, url));
		}
		console.log(results)
		return results;
	});
}

//getData();