/* GET_nyt_url.js
 * Script to get and output a list of the URLs for the given search query
 * Output has to be saved via terminal (node GET_url.js > output.txt)
 */

// Dependencies
var request = require("request");
var fs = require("fs");
var key = "f19eb237560f6772feeb6e955625f491:14:70018996"; // api key for article search
// Adjust queries - do one at a time
var search = "Tesla Motors";
var urls = [];
// var paging = ??

function getData() {
	var query = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&begin_date=20140918&end_date=20141018&sort=oldest" + "&api-key=" + key;
	console.log(query);
	request({
		url: query,
		json: true
	}, 
	function(error, response, data) {
		if (error) {
			throw error;
		}
		//console.log(data.response.meta.hits);
		var docs = data.response.docs;
		for (var d in docs) {
			urls.push(docs[d].web_url);
		}
		console.log(urls);
	});
}

getData();