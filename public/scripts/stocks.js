
$.post("/stocks",
  {
    stockTicker:"GOOG"
  },
  function(unsortedData,status){
	populateTopNews(unsortedData)

	$.get("/sortStocks",function(sortedData){
		populateTopSentiment(sortedData)
		createGraph(unsortedData);
	})
  });

$.post("/company",
	{
		stockName: "Google",
		stockTicker: "GOOG"
	},
	function(results, status) {
		populateCompanyData(results);
	});

$.post("/ceo", 
	{
		ceoName: "Larry Page"
	},
	function(unsortedData, status) {
		//populateTopNews(unsortedData)

		$.get("/sortCeo", function(sortedData){
		//populateTopSentiment(sortedData)
		})
	});

$.post("/stocksBloomberg",
	{
		stockTicker: "GOOG"
	},
	function(results, status) {
		console.log("Bloomberg Object")
		console.log(results[1]);
	});

$.post("/company",
	{
		stockTicker: "GOOG"
	},
	function(results, status) {
		populateCompanyData(results);
	});


function populateTopNews(unsortedData){
	$("#newsFeedList").empty();
	for(i = 0;i<8;i++)
	{
		var temp = unsortedData[i];
		var title = temp.title;
		var url = temp.url;
		var newsDate = temp.date;
		$("#newsFeedList").append("<li class = 'm-b-10'><span class = 'itemTitle'><a href = '"+url +"'>"+ title+"</a></span><small class = 'itemDate text-muted m-l-10'>"+newsDate + "</small></li>")
	}
}

function createGraph(unsortedData){

// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 600 - margin.left - margin.right,
	height = 270 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");// Format tooltip date / time

// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);

// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });

// Define 'div' for tooltips
var div = d3.select("body")
	.append("div")  // declare the tooltip div 
	.attr("class", "tooltip")              // apply the 'tooltip' class
	.style("opacity", 0);                  // set the opacity to nil

// Adds the svg canvas
var	svg = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", 
		      "translate(" + margin.left + "," + margin.top + ")");

	// Scale the range of the data
	x.domain(d3.extent(unsortedData, function(d) { return d.date; }));
	y.domain([0, d3.max(unsortedData, function(d) { return d.close; })]);

	// Add the valueline path.
	svg.append("path")		
		.attr("class", "line")
		.attr("d", valueline(data));

	// draw the scatterplot
	svg.selectAll("dot")									
		.data(unsortedData)											
	.enter().append("circle")								
		.attr("r", 5)	
		.attr("cx", function(d) { return x(d.date); })		 
		.attr("cy", function(d) { return y(d.score); })
	// Tooltip stuff after this
	    .on("mouseover", function(d) {		
            div.transition()
				.duration(500)	
				.style("opacity", 0);
			div.transition()
				.duration(200)	
				.style("opacity", .9);	
			div	.html(
				'<a href= "http://google.com">' + // The first <a> tag
				formatTime(d.date) +
				"</a>" +                          // closing </a> tag
				"<br/>"  + d.close)	 
				.style("left", (d3.event.pageX) + "px")			 
				.style("top", (d3.event.pageY - 28) + "px");
			});

	// Add the X Axis
	svg.append("g")	
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add the Y Axis
	svg.append("g")	
		.attr("class", "y axis")
		.call(yAxis);
	}

function populateTopSentiment(sortedData){
	$("#negativeSentiment").empty();
	for( i = 0;i<5;i++)
	{
		var temp = sortedData[i];
		var title = temp.title;
		var score = temp.score;
		var url = temp.url;
		if(score<=0)
		{
			$("#negativeSentiment").append("<div class = 'media'><div class = 'pull-right'><div class = 'counts negative'>" + score+ "</div></div><div class = 'media body'><a href = '"+ url+"'><h6>"+ title+ "</h6></a></div></div>")
		}

	}
	$("#positiveSentiment").empty();
	for(i = sortedData.length-1;i>sortedData.length-6;i=i-1)
	{
		var temp = sortedData[i];
		var title = temp.title;
		var score = temp.score;
		if(score>=0)
		{
			$("#positiveSentiment").append("<div class = 'media'><div class = 'pull-right'><div class = 'counts positive'>" + score+ "</div></div><div class = 'media body'><a href = '"+ url+"'<h6>"+ title+ "</h6></a></div></div>")
		}

	}
}

function populateCompanyData(company) {
	var name = company.name;
	var ceo = company.ceo;
	var logo_link = company.logo;
	var homePage = "http://" + company.homePage;

	if (name === "AMD") {
		name = "Advanced Micro Devices";
	}
	else if (name === "IBM") {
		$('.m-0').text("IBM");
	}
	else if (name === "Google") {
		$('m-0').text("GOOG");
	}
	else if (name === "Tesla Motors") {
		$('m-0').text("TSLA");
	}
	$("#profile-menu > #sub").text(name);
	$(".profile-pic").attr("src", logo_link);
	$(".profile-pic").click(function() {
		window.location.href = homePage;
	});

}