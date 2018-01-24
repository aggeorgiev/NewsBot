require('dotenv-extended').load();

var restify = require('restify'),
    builder = require('botbuilder'),
    newsService = require('./news-service.js');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT, function() {
    console.log('%s listening to %s', server.name, server.url);
});

var chatConnector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var chatBot = new builder.UniversalBot(chatConnector);
server.post('/api/messages', chatConnector.listen());

chatBot.dialog('/', function(session) {
  newsService.getNews(session.message.text).then(response => {
      response.articles.forEach(function(news){
        var message = new builder.Message(session)
              .text(`[${news.title}](${news.url})\n\n`)
              .textFormat('markdown');
        session.send(message);
      });
      if (response.articles.length === 0) {
        session.send('No news found.');
      }
  }, (error) => {
  	session.send('pattern: . about [.]"');
  });
});
