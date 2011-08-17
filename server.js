var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

app.configure(function(){
  app.set('views',__dirname + '/views');
  app.set('view engine','jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
});

app.listen(80);

