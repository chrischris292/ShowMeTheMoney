
$.post("/stocks",
  {
    stockTicker:"aapl"
  },
  function(data,status){
  	console.log(data)

	$.get("/sortStocks",function(sortedData){
		console.log(sortedData);
		populateTopSentiment(sortedData)
	})
    //alert("Data: " + data + "\nStatus: " + status);
  });



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
		console.log(i)
		var temp = sortedData[i];
		var title = temp.title;
		var score = temp.score;
		if(score>=0)
		{
			$("#positiveSentiment").append("<div class = 'media'><div class = 'pull-right'><div class = 'counts positive'>" + score+ "</div></div><div class = 'media body'><a href = '"+ url+"'<h6>"+ title+ "</h6></a></div></div>")
		}

	}
}