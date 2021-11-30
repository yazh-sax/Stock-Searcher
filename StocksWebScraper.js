//Extracts HTML of a website and returns it as text
async function getHTML(url) {
  var res = await fetch(url);
  var html = await res.text();
  return html;
}

//Scans "html" for "target" div/class identifier and returns inner HTML 
function parseHtmlTarget(html, target) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  var targets = doc.querySelector(target);
  var output = targets.innerHTML;
  return output;
}

/*Generates Links for Analytics
function getLinks(ticker) {
  var websites = [
    ["CNBC", "https://www.cnbc.com/quotes/" + ticker]
    ["NASDAQ", "https://www.nasdaq.com/market-activity/stocks/" + ticker]
    ["Yahoo Finance", "https://finance.yahoo.com/quote/"]
    ["CNN Money", "https://money.cnn.com/quote/forecast/forecast.html?symb=" + ticker]
    ["MarketWatch", "https://www.marketwatch.com/investing/stock/" + ticker]
  ]
  return websites;
}
*/

//Compiles data
async function doWork() {
  //Gets stock's ticker from searchbar
  var ticker = document.getElementById('searchTicker').value;

  //Fetches stock quote
  var quoteUrl = "https://www.cnbc.com/quotes/" + ticker;
  var quoteHtml = await getHTML(quoteUrl);
  var quote = parseHtmlTarget(quoteHtml, '.QuoteStrip-lastPrice');

  //Fetches stock description;
  var descHtml = await getHTML(descUrl);
  var desc = parseHtmlTarget(descHtml, '.CompanyProfile-summary');

  //Fetches links
  //var link = getLinks(ticker)

  //Writes data to HTML page
  var valnode1 = document.getElementById("currentValue");
  while (valnode1.firstChild)
    valnode1.removeChild(valnode1.firstChild);
  var textnode1 = document.createTextNode(quote);
  valnode1.appendChild(textnode1);

  var valnode2 = document.getElementById("stockDescription");
  while (valnode2.firstChild)
    valnode2.removeChild(valnode2.firstChild);
  var textnode2 = document.createTextNode(desc);
  valnode2.appendChild(textnode2);

  /*
  var valnode1 = document.getElementById("externalLinks");
  while (valnode1.firstChild)
    valnode1.removeChild(valnode1.firstChild);
  var textnode1 = document.createTextNode("<a href=" + link[0][1] + " " + "id=" + link[0][0] + link[0][0] + "</a>" + "<br>");
  valnode1.appendChild(textnode1);

  */
}


