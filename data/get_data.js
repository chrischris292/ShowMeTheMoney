/* get_data.js
 * Parses the RSS feeds from Google Feed API for a given search query
 * 
 * Usage: node get_data.js > output.txt
 */

// Dependencies
var request = require("request");
var fs = require("fs");
// Adjust queries - do one at a time
var search = "tesla";

function getData() {
	var query = "https://news.google.com/news/feeds?q=" + search + "&output=rss";
	console.log(query);
	request({
		url: query,
		json: true
	}, 
	function(error, response, data) {
		if (error) {
			throw error;
		}
	});
}

getData();