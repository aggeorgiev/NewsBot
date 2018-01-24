var chrono = require('chrono-node');
var nlp = require('compromise')
var NewsAPI = require('newsapi');

var newsapi = new NewsAPI(process.env.NEWS_API_KEY);

exports.getNews = function(text) {
    console.log(text);
    var r = nlp(text);
    var topic = r.match('. about [.]').out('normal');
    console.log(topic);
    var q = {
      q: topic,
      language: 'bg',
    }
    var dates = chrono.parse(text);
    if (typeof dates[0] !== 'undefined') {
	  if (typeof dates[0].start !== 'undefined') {
	  	var from = dates[0].start.date();
		q.from = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
	  }
	  if (typeof dates[0].end !== 'undefined') {
	 	var to = dates[0].end.date();
		q.to = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();
	  }
    }
    return newsapi.v2.everything(q);
}
