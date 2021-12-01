var apiKey = "R0M637EL9BIKKN7B";

async function getHTML(url) {
  var res = await fetch(url);
  var html = await res.text();
  return html;
}
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
  ]

  return websites;
}

async function getFromAPI(ticker, request) {
  var resp = await fetch("https://www.alphavantage.co/query?function=OVERVIEW&symbol="+ticker+"&apikey="+apiKey, {headers: {'User-Agent': 'request'}});
  var respjson = await resp.text();
  var respdata = JSON.parse(respjson);
  // console.log(respdata + "." + request);
  var returnAsk = respdata[request];
  return returnAsk;
}
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
  var links = getLinks(ticker)

  //Writes data
  var valnode1 = document.getElementById("currentValue");
  while (valnode1.firstChild)
    valnode1.removeChild(valnode1.firstChild);
  var textnode1 = document.createTextNode(quote);
  valnode1.appendChild(textnode1);

  var textnode2 = document.createTextNode(desc);
  var valnode2 = document.getElementById("stockDescription");
  while (valnode2.firstChild)
    valnode2.removeChild(valnode2.firstChild);
  valnode2.appendChild(textnode2);

  var stkname = await getFromAPI(ticker, "Name");
  var textnode3 = document.createTextNode(stkname);
  var valnode3 = document.getElementById("stockName");
  while (valnode3.firstChild)
    valnode3.removeChild(valnode3.firstChild);
  valnode3.appendChild(textnode3);

   // Create hyperlinks for external links
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

    //Adds newly created hyperlink element to <div> titled "externalLinks"
    document.getElementById("externalLinks").appendChild(valnode3)

    //Adds break between links
    var valnodebr = document.createElement("br")
    document.getElementById("externalLinks").appendChild(valnodebr)
  }
}
