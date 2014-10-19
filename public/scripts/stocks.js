$(document).on('keydown', '#inputFormTicker', function(ev) {
    if(ev.which === 13) {
		$('#myChart').empty();
        // Will change backgroundColor to blue as example
		var temp = $(this).val();  
		if (temp.toLowerCase() == "amd") {
			sname = "Advanced Micro Devices";
		}
		else if (temp.toLowerCase() == "tsla") {
			sname = "Tesla Motors";
		}
		else if (temp.toLowerCase() == "goog") {
			sname = "Google";
		}
		else if (temp.toLowerCase() == "ibm") {
			sname = "IBM";
		}
		else if (temp.toLowerCase() == "appl") {
			sname = "Apple";
		}

		$('#myCanvas').css("width", "400px");
		$('#myCanvas').css("height", "880px");

		init(temp, sname);    
        // Avoid form submit

        return false;
    }
});
init("GOOG", "google")
function init(stockTickerValue, stockName)
{
	$.post("/stocks",
	  {
	    stockTicker:stockTickerValue
	  },
	  function(unsortedData,status){
		populateTopNews(unsortedData)

		$.get("/sortStocks",function(sortedData){
			populateTopSentiment(sortedData)
			$.post("/stocksBloomberg",
				{
					stockTicker: stockTickerValue
				},
				function(results, status) {
					createGraph(unsortedData, results);
				});
		})
	  });

	$.post("/company",
		{
			stockName: stockName,
			stockTicker: stockTickerValue
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
			//console.log("Bloomberg Object")
			//console.log(results[1]);
			return results[1];
		});

	$.post("/company",
		{
			stockTicker: "GOOG"
		},
		function(results, status) {
			populateCompanyData(results);
		});

}

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

Day = function(date, score, url, title) {
	var temp = new Date(date);
	this.date = date;//temp.getFullYear() + " " + temp.getDate() + " " + temp.getDate();
	this.score = score;
	this.url = url;
	this.title = title;
}	

function createGraph(unsortedData, results) {
	// Largest and smallest volumes/scores
	var largestScore, lowestScore, largestVolume, lowestVolume = 0;

	// Get the aggregated scores for the scraped days
	var ctr = 0;
	unsortedData = unsortedData.reverse();
	var last = unsortedData[0].date.split(0 , 10);
	var d = [];
	var largestScore = unsortedData[0].score;
	var lowestScore = unsortedData[0].score;
	d.push(new Day(last, unsortedData[0].score,unsortedData[0].url,unsortedData[0].title));
	for (var i = 1; i < unsortedData.length; i++) {
		var date = unsortedData[i].date.split(0,10);
		if (date <= last) {
			d[ctr].score += unsortedData[i].score;
			if (d[ctr].score > largestScore) {
				largestScore = d[ctr].score;
			}
			else if (d[ctr].score < lowestScore) {
				lowestScore = d[ctr].score;
			}
		}
		else {
			last = d[ctr];
			d.push(new Day(date, unsortedData[i].score, unsortedData[i].url,unsortedData[i].title));
			if (d[ctr].score > largestScore) {
				largestScore = d[ctr].score;
			}
			else if (d[ctr].score < lowestScore) {
				lowestScore = d[ctr].score;
			}
			ctr++;
		}
	}

	//console.log(d);
	//console.log(results);
	//console.log(unsortedData);

	var d1 = []; // volume data
	for (var x = 0; x < results[1].prices.length && x < 10; x++) {
		d1.push(results[1].prices[x].volume);
	}	

	var ls = [];
	for (var x = 0; x < d1.length; x++) {
		ls.push("-");
	}

	var d2 = [];
	for (var x = 0; x < unsortedData.length; x++) {
		d2.push(unsortedData[x].score*1000000); // normalization by multiplying by a mil
	}



	var options = {
		scaleFontColor: "rgba(244,244,244,1)",

	    ///Boolean - Whether grid lines are shown across the chart
	    scaleShowGridLines : true,

	    //String - Colour of the grid lines
	    scaleGridLineColor : "rgba(244,244,244,.07)",

	    //Number - Width of the grid lines
	    scaleGridLineWidth : 2,

	    //Boolean - Whether the line is curved between points
	    bezierCurve : true,

	    //Number - Tension of the bezier curve between points
	    bezierCurveTension : 0.4,

	    //Boolean - Whether to show a dot for each point
	    pointDot : true,

	    //Number - Radius of each point dot in pixels
	    pointDotRadius : 2,

	    //Number - Pixel width of point dot stroke
	    pointDotStrokeWidth : 1,

	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	    pointHitDetectionRadius : 20,

	    //Boolean - Whether to show a stroke for datasets
	    datasetStroke : true,

	    //Number - Pixel width of dataset stroke
	    datasetStrokeWidth : 4,

	    //Boolean - Whether to fill the dataset with a colour
	    datasetFill : true,
	};

	var data = {
    labels: ls,
    datasets: [
        {
            label: "Volume Data Set",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "#34495e",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: d1
        },
        {
            label: "Sentiment Score Data Set",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "#2ecc71",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: d2
        }
    ]
};

	var ctx = $("#myChart").get(0).getContext("2d");
	var myLineChart = new Chart(ctx).Line(data, options);

	/*
	var saveD = []
	for(i = 0;i<d.length;i++)
		saveD.push(d[i]);
	var saveSentiment = d;
	var sentimentData = [];
	sentimentData.push("Sentiment Analysis");
	for(i = 0; i<d.length;i++)
	{
		sentimentData.push(d[i].score);
	}
	bloombergData = [];
	bloombergData.push("Bloomberg");
	for(i = (results[1].prices.length-d.length); i<results[1].prices.length;i++)
	{
		bloombergData.push(results[1].prices[i].volume)
	}
	tempArrayX = [];
	tempArrayX[0] = 'x';
	for(i=0;i<results.length;i++)
	{
		temp = new Date(results[1].prices[i].date)
		year = temp.getFullYear();
		month = temp.getDate();
		day = temp.getDay();
		temp = year + "-" + month + "-" + day;
		tempArrayX.push(temp)
	}
	console.log(bloombergData)
	console.log(sentimentData)
	console.log(tempArrayX)
var chart = c3.generate({
    bindto: '#chart',
    data: {
    	x:"x",
      columns: [
      	tempArrayX,
        sentimentData,
        bloombergData
      ],
      axes: {
        bloombergData: 'y2' // ADD
      }
    },
    axis: {
      y2: {
        show: true // ADD
      }
    },
    tooltip: {
    	format: {
        title: function (d) {	
        	console.log(saveD)
        	var temp = new Date(d);
        	year = temp.getFullYear();
			month = temp.getDate();
			day = temp.getDay();
        	temp = year + " " + month + " " + day;
			for(i = 0; i<saveD.length;i++)
			{
				console.log(saveD[i].date)
				console.log(temp)
				if(saveD[i].date===temp)
				console.log("hi")
				return saveD.title;
			}
        	return d; 
        },
        value: function (value, ratio, id) {
            var format = id === 'diarrhea' ? d3.format(',') : d3.format('$');
            return format(value);
        		}
	//            value: d3.format(',') // apply this format to both y and y2
    		}
    	},
     axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }

});

*/

}

function populateTopSentiment(sortedData){
	$("#negativeSentiment").empty();
	for( i = 0;i<5;i++)
	{
		var temp = sortedData[i];
		var title = temp.title;
		var score = temp.score;
		var url = temp.url;
		var newsDate = temp.date;

		if(score<=0)
		{
			$("#negativeSentiment").append("<div class = 'media'><div class = 'pull-right'><div class = 'counts negative'>" + score+ "</div></div><div class = 'media body'><a href = '"+ url+"'><h6>"+ title+ "</h6></a><p>"+newsDate+"</p></div></div>")
		}

	}
	$("#positiveSentiment").empty();
	for(i = sortedData.length-1;i>sortedData.length-6;i=i-1)
	{
		var temp = sortedData[i];
		var title = temp.title;
		var score = temp.score;
		var newsDate = temp.date;

		if(score>=0)
		{
			$("#positiveSentiment").append("<div class = 'media'><div class = 'pull-right'><div class = 'counts positive'>" + score+ "</div></div><div class = 'media body'><a href = '"+ url+"'<h6>"+ title+ "</h6></a><p>"+newsDate+"</p></div></div>")
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
		$('.m-0').text("AMD");
	}
	else if (name === "IBM") {
		$('.m-0').text("IBM");
	}
	else if (name === "Google") {
		$('.m-0').text("GOOG");
	}
	else if (name === "Tesla Motors") {
		$('.m-0').text("TSLA");
	}
	else if (name === "Apple") {
		$('.m-0').text("APPL");
	}
	$("#profile-menu > #sub").text(name);
	$(".profile-pic").attr("src", logo_link);
	$(".profile-pic").click(function() {
		window.location.href = homePage;
	});
    $('#myChart').replaceWith('<canvas id="myChart" width="880" height="400"></canvas>');
}