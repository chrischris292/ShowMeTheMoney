
$.post("/stocks",
  {
    stockTicker:"amd"
  },
  function(unsortedData,status){
	populateTopNews(unsortedData)

	$.get("/sortStocks",function(sortedData){
		populateTopSentiment(sortedData)
		createGraph(unsortedData);
	})
    //alert("Data: " + data + "\nStatus: " + status);
  });

$.post("/company",
	{
		stockName: "AMD",
		stockTicker: "amd"
	},
	function(results, status) {
		populateCompanyData(results);
	});

$.post("/ceo", 
	{
		ceoName: "Elon Musk"
	},
	function(unsortedData, status) {
		populateTopNews(unsortedData)

		$.get("/sortCeo", function(sortedData){
		populateTopSentiment(sortedData)
		})
	});

function populateTopNews(unsortedData) {
	for(i = 0;i<8;i++)
	{
		var temp = unsortedData[i];
		var title = temp.title;
		var url = temp.url;
		var newsDate = temp.date;
		$("#newsFeedList").append("<li class = 'm-b-10'><span class = 'itemTitle'><a href = '"+url +"'>"+ title+"</a></span><small class = 'itemDate text-muted m-l-10'>"+newsDate + "</small></li>")
	}
}

function createGraph(data) {

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
		.y(function(d) { return y(d.score); });

	// Define 'div' for tooltips
	var div = d3.select("body")
		.append("div")  						// declare the tooltip div 
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

	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.score = + d.score;
	});

	console.log(data);

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.score })]);

	// Add the valueline path.
	svg.append("path")		
		.attr("class", "line")
		.attr("d", data);//valueline(data));

	// draw the scatterplot
	svg.selectAll("dot")									
		.data(data)											
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
				"<br/>"  + d.score)	 
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

	};
		/*
	var options = {

	    ///Boolean - Whether grid lines are shown across the chart
	    scaleShowGridLines : true,

		//String - Colour of the grid lines
    	scaleGridLineColor : "rgba(222,222,222,0.5)",

	    //Number - Width of the grid lines
	    scaleGridLineWidth : 1,

	    //Boolean - Whether the line is curved between points
	    bezierCurve : true,

	    //Number - Tension of the bezier curve between points
	    bezierCurveTension : 0.4,

	    //Boolean - Whether to show a dot for each point
	    pointDot : true,

	    //Number - Radius of each point dot in pixels
	    pointDotRadius : 4,
    	scaleFontColor: "#fefefe",

	    //Number - Pixel width of point dot stroke
	    pointDotStrokeWidth : 1,

	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	    pointHitDetectionRadius : 20,

	    //Boolean - Whether to show a stroke for datasets
	    datasetStroke : true,

	    //Number - Pixel width of dataset stroke
	    datasetStrokeWidth : 4,

	    //Boolean - Whether to fill the dataset with a colour
	    datasetFill : false,

	    //String - A legend template
	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%='datasets[i].lineColor'%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};

	var data = {
	    labels: ["January", "February", "March", "April", "May", "June", "July"],
	    datasets: [
	        {
		 		animationEasing: "easeOutBack",
	            label: "My First dataset",
	            fillColor: "#000",
	            strokeColor: "yellow",
	            //strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 80, 81, 56, 55, 40]
	        },
	        {
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 86, 27, 90]
	        }
	    ]
	};
		
	var ctx = document.getElementById("myChart").getContext("2d");
	var myLineChart = new Chart(ctx).Line(data, options);
	*/	

function populateTopSentiment(sortedData) {
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
	$("#profile-menu").append(name);
	$(".profile-pic").attr("src", logo_link);
	$(".profile-pic").click(function() {
		window.location.href = homePage;
	});
}