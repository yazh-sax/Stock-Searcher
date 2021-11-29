async function getHTML(url) {
        var res = await fetch(url);
        var html = await res.text();
        return html;
}
function parseHtmlTarget(html, target) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        //console.log(doc);
        var targets = doc.querySelector(target);
        var output = targets.innerHTML;
        return output;

}
async function doWork() {
        //Gets stock's ticker
        var ticker = document.getElementById('searchTicker').value

        //Gets stock quote
        var quoteUrl = "https://www.cnbc.com/quotes/" + ticker
        var quoteHtml = await getHTML(quoteUrl);
        var quote = parseHtmlTarget(quoteHtml, '.QuoteStrip-lastPrice');

        //Gets stock description
        var descUrl = "https://www.cnbc.com/quotes/" + ticker
        var descHtml = await getHTML(descUrl);
        var desc = parseHtmlTarget(descHtml, '.CompanyProfile-summary');

        //Writes data
        document.write(quote + "<br>" + desc)
}
