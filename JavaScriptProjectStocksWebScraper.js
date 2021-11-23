async function getQuote(ticker) {
  var res = await fetch("https://www.cnbc.com/quotes/"+ticker);
  var html = await res.text();
  return html;
}
function parseHtmlForQuote(html) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  var elLastPrice = doc.querySelector('.QuoteStrip-lastPrice');
  var lastPrice = elLastPrice.innerHTML;
  return lastPrice;
}
async function doWork() {
  var ticker1 = document.getElementById('searchTicker').value
  var quoteHtml = await getQuote(ticker1);
  var quote = parseHtmlForQuote(quoteHtml);
  document.write(quote);
}
