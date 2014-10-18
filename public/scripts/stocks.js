$.post("/stocks",
  {
    stockTicker:"aapl"
  },
  function(data,status){
  	console.log(data)
    alert("Data: " + data + "\nStatus: " + status);
  });