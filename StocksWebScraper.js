var apiKey = "YNSQGYK4RWBPH09G";

//Fetches HTML for any website (used for parseHtmlTarget function)
async function getHTML(url) {
  var res = await fetch(url);
  var html = await res.text();
  return html;
}

//Returns specific HTML element's inner HTML data (used to get live price)
function parseHtmlTarget(html, target) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  var targets = doc.querySelector(target);
  var output = targets.innerHTML;
  return output;
}

//Generates Links for Analytics
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

//Gets stock information in JSON file from stock API
async function getFromAPI(ticker, request) {
  var resp = await fetch("https://www.alphavantage.co/query?function=OVERVIEW&symbol="+ticker+"&apikey="+apiKey, {headers: {'User-Agent': 'request'}});
  var respjson = await resp.text();
  var respdata = JSON.parse(respjson);;
  var returnAsk = respdata[request];
  return returnAsk;
}

//Shows or hides element on button click (used to show/hide instructions)
function showHide(elementID) {
  var element = document.getElementById(elementID);
  if(element.style.display == 'none')
     element.style.display = 'block';
  else
     element.style.display = 'none';
}

//Hides element (for hiding instructions on search)
function hide(elementID) {
  var element = document.getElementById(elementID);
  element.style.display = 'none'
}

//Fetches and arranges the stock information using the functions
async function doWork() {
  //Gets stock's ticker
  var ticker = document.getElementById('searchTicker').value

  //Gets stock quote
  var quoteUrl = "https://www.cnbc.com/quotes/" + ticker
  var quoteHtml = await getHTML(quoteUrl);
  var quote = parseHtmlTarget(quoteHtml, '.QuoteStrip-lastPrice');

  //Gets stock description
  var desc = await getFromAPI(ticker, "Description");

  //Gets external links
  var links = getLinks(ticker);

  //Gets stock name
  var stkname = await getFromAPI(ticker, "Name");

  //Writes new price and clears old value
  document.getElementById("currentValue").innerHTML = "";
  document.getElementById("currentValue").innerHTML = quote

  //Writes stock description and clears old value
  document.getElementById("stockDescription").innerHTML = "";
  document.getElementById("stockDescription").innerHTML = desc

  //Writes stock name and clears old value
  document.getElementById("stockName").innerHTML = "";
  document.getElementById("stockName").innerHTML = stkname


  //Writes new links and clears old values
  document.getElementById("externalLinks").innerHTML = "";
  for (var i = 0; i < links.length; i++) {
    //Creates hyperlink element
    var valnode3 = document.createElement("a")
    //Creates text for hyperlink
    var textnode3 = document.createTextNode(links[i][1]);
    //Adds text to hyperlink
    valnode3.appendChild(textnode3);
    //Adds title to hyperlink
    valnode3.title = links[i][1];
    //Adds destination link to hyperlink
    valnode3.href = links[i][0];
    //Adds target to blank to open in new tab
    valnode3.target = "_blank"
    //Adds newly created hyperlink element to <div> titled "externalLinks"
    document.getElementById("externalLinks").appendChild(valnode3)
    //Adds break between links
    var valnodebr = document.createElement("br")
    document.getElementById("externalLinks").appendChild(valnodebr)
  }
}
