
$.post("/stocks",
  {
    stockTicker:"amd"
  },
  function(unsortedData,status){
	populatetopNews(unsortedData)

	$.get("/sortStocks",function(sortedData){
		populateTopSentiment(sortedData)
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


function populatetopNews(unsortedData){
	for(i = 0;i<8;i++)
	{
		var temp = unsortedData[i];
		var title = temp.title;
		var url = temp.url;
		var newsDate = temp.date;
		$("#newsFeedList").append("<li class = 'm-b-10'><span class = 'itemTitle'><a href = '"+url +"'>"+ title+"</a></span><small class = 'itemDate text-muted m-l-10'>"+newsDate + "</small></li>")
	}
		var data = {
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rwhit",
		            strokeColor: "rgba(220,220,220,1)",
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
		var options = {
			    ///Boolean - Whether grid lines are shown across the chart
			    scaleShowGridLines : true,

			    //String - Colour of the grid lines
			    scaleGridLineColor : "rgba(0,0,0,.05)",

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

			    //Number - Pixel width of point dot stroke
			    pointDotStrokeWidth : 1,

			    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			    pointHitDetectionRadius : 20,

			    //Boolean - Whether to show a stroke for datasets
			    datasetStroke : true,

			    //Number - Pixel width of dataset stroke
			    datasetStrokeWidth : 2,

			    //Boolean - Whether to fill the dataset with a colour
			    datasetFill : true,

			    //String - A legend template
			    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%='datasets[i].lineColor'%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

			};

	var ctx = document.getElementById("myChart").getContext("2d");
	var myLineChart = new Chart(ctx).Line(data);;
}

function populateTopSentiment(sortedData){
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