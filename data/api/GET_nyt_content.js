// Dependencies
var request = require("request");
var cheerio = require("cheerio");
// Adjust queries - do one at a time


function getData() {
	var query = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&api-key=" + key;
	request({
		url: query,
		json: true
	}, 
	function(error, response, data) {
		if (error) {
			throw error;
		}
		var urls = [];
		var docs = data.response.docs;
		for (var d in docs) {
			urls.push(docs[d].web_url);
		}
		console.log(urls);
	});
}

getData();
