var c = require('./Console.js');
var blpapi = require('blpapi');

// stockNames is an array like ['AAPL US Equity', 'MSFT US Equity, GOOG US Equity']
var getPrices = function(stockNames, callback) {
	
	var session = new blpapi.Session({ serverHost: '10.8.8.1', serverPort: 8194 });
	
	var service_refdata = 1; // Unique identifier for refdata service

	var seclist = stockNames;

	var obj = {}
	stockNames.forEach(function(item) {
		obj[item] = {
			name: 'Unknown',
			prices: []
		} 
	})

	session.on('SessionStarted', function(m) {
	    c.log(m);
	    session.openService('//blp/refdata', service_refdata);
	});

	session.on('ServiceOpened', function(m) {
	    //c.log(m);
	    // Check to ensure the opened service is the refdata service
	    if (m.correlations[0].value == service_refdata) {
	        // Request the long-form company name for each security
	        session.request('//blp/refdata', 'ReferenceDataRequest',
	            { securities: seclist, fields: ['LONG_COMP_NAME'] }, 100);
	        // Request intraday tick data for each security, 10:30 - 14:30
	        session.request('//blp/refdata', 'HistoricalDataRequest',
	            { securities: seclist,
	              fields: ['VOLUME'],
	              startDate: "20141011",
	              endDate: "20141018",
	              periodicitySelection: "DAILY",
	              nonTradingDayFillOption: "ALL_CALENDAR_DAYS" }, 101);
	    }
	});

	var responses = 0;
	function checkStop() {
	    responses++;
	    if (responses === 2) // 1st for ReferenceDataRequest, 2nd for HistoricalDataRequest
	        session.stop();
	}

	session.on('ReferenceDataResponse', function(m) {
	    //c.log(m);
	    // At this point, m.correlations[0].value will equal:
	    // 100 -> ReferenceDataResponse for long-form company names
	    
	    if(m.correlations[0].value === 100) {
	    	m.data.securityData.forEach(function(item) {
	    		//console.log(item.fieldData.LONG_COMP_NAME)
	    		obj[item.security].name = item.fieldData.LONG_COMP_NAME
	    	})
	    }

	   	// m.eventType == 'PARTIAL_RESPONSE' until finally
	    // m.eventType == 'RESPONSE' to indicate there is no more data
	    if (m.correlations[0].value === 100 && m.eventType === 'RESPONSE')
	    	checkStop();
	});

	session.on('HistoricalDataResponse', function(m) {
	    //c.log(m);
	    // At this point, m.correlations[0].value will equal:
	    // 101 -> HistoricalDataResponse for both securities

	    
	    if(m.correlations[0].value === 101) {
	    	m.data.securityData.fieldData.forEach(function(item, i) {
	    		console.log("item")
	    		console.log(item)
	    		obj[m.data.securityData.security].prices.push( {"index": i, "volume": item.VOLUME, "date": item.date} )
	    	})
	    }	    

	    // m.eventType == 'PARTIAL_RESPONSE' until finally
	    // m.eventType == 'RESPONSE' to indicate there is no more data
	    if (m.correlations[0].value === 101 && m.eventType === 'RESPONSE')
	        checkStop();
	});

	session.on('SessionTerminated', function(m) {
	    session.destroy();
	    //console.log(obj);
	    callback(obj)
	});

	session.start();

}

exports.magic = function(stockNames, callback) {
	var array = []
	getPrices(stockNames, function(data) {
		stockNames.forEach(function(name) {
			array.push(data[name])
		})
		callback(array)
	})
}