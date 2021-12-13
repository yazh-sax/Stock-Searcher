var apiKey = "OB0VMZZ6IT1JRKJ9";
var favorites = [];

// Fetches HTML for any website (used for parseHtmlTarget function)
async function getHTML(url) {
  var res = await fetch(url);
  var html = await res.text();
  return html;
}

// Returns specific HTML element's inner HTML data (used to get live price)
function parseHtmlTarget(html, target) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  var targets = doc.querySelector(target);
  if (targets == null){
    error()
  }
  var output = targets.innerHTML;
  return output;
}

// Generates Links for Analytics and assigns a name for the hyper link
function getLinks(stockTicker) {
  var websites = [
  ["https://www.cnbc.com/quotes/" + stockTicker, "CNBC"],
  ["https://www.nasdaq.com/market-activity/stocks/" + stockTicker, "NASDAQ"],
  ["https://money.cnn.com/quote/forecast/forecast.html?symb=" + stockTicker, "CNN"],
  ["https://www.marketwatch.com/investing/stock/" + stockTicker, "MarketWatch"],
  ["https://finance.yahoo.com/quote/" +stockTicker + "/profile?p=" + stockTicker, "Yahoo"]
  ]
  return websites;
}

// Gets stock information in JSON file from stock API
var tickerDataCache = {};
async function getFromAPI(ticker, request) {
  if (tickerDataCache[ticker] == null) {
    var resp = await fetch("https://www.alphavantage.co/query?function=OVERVIEW&symbol="+ticker+"&apikey="+apiKey, {headers: {'User-Agent': 'request'}});
    var respjson = await resp.text();
    var respdata = JSON.parse(respjson);;
    tickerDataCache[ticker] = respdata;
    console.log('Got data for ticker' + ticker, respdata);
  }
  var returnAsk = tickerDataCache[ticker][request];
  return returnAsk;
}

// Shows or hides element on button click (used to show/hide instructions)
function showHide(elementID) {
  var element = document.getElementById(elementID);
  if(element.style.display == 'none')
     element.style.display = 'block';
  else
     element.style.display = 'none';
}

// Hides element (for hiding instructions on search)
function hide(elementID) {
  var element = document.getElementById(elementID);
  element.style.display = 'none'
}

// Takes ticker and returns quote, used for favorites tab
async function getQuote(ticker){
  let cnbc = "https://www.cnbc.com/quotes/" + ticker;
  var quoteHtml = await getHTML(cnbc);
  var quote = parseHtmlTarget(quoteHtml, '.QuoteStrip-lastPrice');
  return quote;
}

// Creates variable ticker and gives it to the stockdetailhtml
function goToDetailPage(ticker) {
  if (ticker == null) {
    tickerCase = document.getElementById('searchTicker').value;
	ticker = tickerCase.toUpperCase()
  }
  window.location.href = 'stockDetail.html?ticker='+ticker;
}

// Goes to error page 
function error() {
  window.location.href = 'error.html';
}


// Fetches and arranges the stock information using the functions
async function doWork() {

  // Gets stock's ticker
  var url = window.location.search;
  var ticker = url.substring(url.indexOf('=')+1);

  // Gets stock quote
  var quote = await getQuote(ticker)

  // Gets stock description
  var desc = await getFromAPI(ticker, "Description");

  // Error checking using API return
  if (desc == null) {
    error()
    return
  }

  // Gets external links
  var links = getLinks(ticker);

  // Gets stock name
  var stkname = await getFromAPI(ticker, "Name");

  // Gets additional data from stock API
  var yrHigh = await getFromAPI(ticker, "52WeekHigh")
  var yrLow = await getFromAPI(ticker, "52WeekLow");
  var analystPrice = await getFromAPI(ticker, "AnalystTargetPrice");


  // Writes new price and clears old value
  document.getElementById("currentValue").innerHTML = "";
  document.getElementById("currentValue").innerHTML = "$" + quote

  // Writes stock description and clears old value
  document.getElementById("stockDescription").innerHTML = "";
  document.getElementById("stockDescription").innerHTML = desc

  // Writes stock name and clears old value
  document.getElementById("stockName").innerHTML = "";
  document.getElementById("stockName").innerHTML = stkname

  // Writes stock's 52 week high
  document.getElementById("yrHigh").innerHTML = "";
  document.getElementById("yrHigh").innerHTML = "52 week high: $" + yrHigh

  // Writes stock's 52 week low
  document.getElementById("yrLow").innerHTML = "";
  document.getElementById("yrLow").innerHTML = "52 week low: $" + yrLow
  
  // Writes stock's analyst price target
  document.getElementById("priceTarget").innerHTML = "";
  document.getElementById("priceTarget").innerHTML = "Analysts' price target: $" + analystPrice

  // Writes new links and clears old values
  document.getElementById("externalLinks").innerHTML = "";
  for (var i = 0; i < links.length; i++) {
    // Creates hyperlink element
    var valnode3 = document.createElement("a")
    // Creates text for hyperlink
    var textnode3 = document.createTextNode(links[i][1]);
    // Adds text to hyperlink
    valnode3.appendChild(textnode3);
    // Adds title to hyperlink
    valnode3.title = links[i][1];
    // Adds destination link to hyperlink
    valnode3.href = links[i][0];
    // Adds target to blank to open in new tab
    valnode3.target = "_blank"
    // Adds newly created hyperlink element to <div> titled "externalLinks"
    document.getElementById("externalLinks").appendChild(valnode3)
  }

  // Checks whether stock is already a favorite
  for (var i = 0; i < favorites.length; i++) {
	  if (favorites[i] == ticker) {
      var heart = document.getElementsByClassName('favSelector');
      //Fills in heart if already favorited
		  $(heart).addClass('isfav');
		  break;
	  }
  }

// Takes the liked item and makes it an item in the favorites list when heart clicked
	$('.favSelector').on('click', function() {
    // If already favorited, remove from favorite list
		if ($('.favSelector').hasClass('isfav')) {
			$('.favSelector').removeClass('isfav');
			var fav2 = [];
			for (var i = 0; i < favorites.length; i++)
				if (favorites[i] != ticker)
					fav2.push(favorites[i]);
      favorites = fav2;
    // If not favorited, push to favorite list
		} else {
			$('.favSelector').addClass('isfav');
			favorites.push(ticker);
		}
    localStorage.setItem('favorites', favorites.join(','));
    // Update the local favorite list
	});
}

//Spin-off of original taken from GeeksforGeeks (https://www.geeksforgeeks.org/how-to-creating-html-list-from-javascript-array/)
async function listFavPrice() {
  var data = [];
  // Writes favorite stocks to favorite "data" array if favorites have been selexted
	if (favorites.length > 0) {
		for (var i = 0; i < favorites.length; i++) {
      var favticker = favorites[i];
			data.push(favticker + ": $" + await getQuote(favticker));
    }
    
	} else {
		// Makes these stocks favorites if there are none chosen
		data = [
			"Apple (AAPL): $" + await getQuote("AAPL"),
			"Tesla (TSLA): $" + await getQuote("TSLA"),
			"Google (GOOG): $" + await getQuote("GOOG"),
			"AMD (AMD): $" + await getQuote("AMD"),
			"NVIDIA (NVDA): $" + await getQuote("NVDA"),
			"Shopify (SHOP): $" + await getQuote("SHOP"),
			"GameStop (GME): $" + await getQuote("GME"),
			"Alibaba (BABA): $" + await getQuote("BABA")
		  ]		
	}

// Clears old favorites and writes new favorite "data" array
  document.getElementById("favList").innerHTML = ""
  for (var i = 0; i < data.length; i++) {
    var li = document.createElement("li");
    li.innerText = data[i]
    document.getElementById("favList").appendChild(li);
  }
}

// Makes an autocomplete search box
function postInit() {
  $( "#searchTicker" ).autocomplete({
      source: function(req, resp) {
        $.ajax({
          // Uses the alphavantage api to get possible values for the company ticker 
          url: 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey='+apiKey+'&keywords='+req.term,
          // Shows potential autocomplete terms if api call was successful
          success: function(data) {
            console.log(data);
            var options = [];
            for (var i = 0; i < data.bestMatches.length; i++) {
              var match = data.bestMatches[i];
            options.push({label: match["2. name"], value: match["1. symbol"]});
            }
            resp(options);
          }
        });
      },
      minLength: 2,
      select: function( event, ui ) {
        console.log( "Selected: " + ui.item.value + " aka " + ui.item.label, ui.item );
        document.getElementById('searchTicker').value = ui.item.value;
        doWork();
      }
    });
    // Stores favorites data in browser for future use
    var f= localStorage.getItem('favorites');
    if (f != null)
    	favorites = f.split(',');
}
  
