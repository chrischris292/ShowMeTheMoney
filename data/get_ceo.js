/* get_ceo.js
 * Uses the Glassdoor API to get the names of CEOs of companies
 */

// Dependencies
var request = require("request");
var fs = require("fs");
// Adjust queries - do one at a time
var search = "Tesla+Motors";

function Glass(name, ceo, logo, homePage) {
	this.name = name;
	this.ceo = ceo;
	this.logo = logo;
	this.homePage = homePage;
}

function getData() {
	var query = "http://api.glassdoor.com/api/api.htm?t.p=26106&t.k=g3q6WWopG8O&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=" + search;
	request(query, function(error, response, data) {
		var name = JSON.parse(data).response.employers[0].name;
		var ceo = JSON.parse(data).response.employers[0].ceo.name;
		var logo = JSON.parse(data).response.employers[0].squareLogo;
		var homePage = JSON.parse(data).response.employers[0].website;
		var company = new Glass(name, ceo, logo, homePage);
		return company;
	});
}

getData();
