
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