// Dependencies
var request = require("request");
var key = "f19eb237560f6772feeb6e955625f491:14:70018996"; // api key for article search
// Adjust queries - do one at a time
var search = "Tesla";
// var paging = ??

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
