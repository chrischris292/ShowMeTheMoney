$.post("/stocks",
  {
    stockTicker:"intc"
  },
  function(data,status){
  	var temp = data;
  	temp = JSON.stringify(temp);
  	console.log(data)
    //alert("Data: " + data + "\nStatus: " + status);
  });