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

//Compiles data
async function doWork() {

  //Gets stock's ticker from searchbar
  var ticker = document.getElementById('searchTicker').value;

  //Fetches stock quote
  var quoteUrl = "https://www.cnbc.com/quotes/" + ticker;
  var quoteHtml = await getHTML(quoteUrl);
  var quote = parseHtmlTarget(quoteHtml, '.QuoteStrip-lastPrice');

  //Fetches stock description;
  var descUrl = "https://www.cnbc.com/quotes/" + ticker;
  var descHtml = await getHTML(descUrl);
  var desc = parseHtmlTarget(descHtml, '.CompanyProfile-summary');

  //Gets links
  var links = getLinks(ticker)

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

  // Create Links
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

