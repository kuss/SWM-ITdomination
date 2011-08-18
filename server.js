var Express = require('express');
var app = module.exports = Express.createServer();

var Io = require('socket.io').listen(app);
var Constant = require('./lib/constant');
var Game = require('./lib/game');
var User = require('./lib/user');

app.configure(function(){
  app.set('views',__dirname + '/views');
  app.set('view engine','jade');
  app.use(Express.bodyParser());
  app.use(Express.methodOverride());
  app.use(app.router);
  app.use(Express.static(__dirname + '/public'));
  app.use(Express.cookieParser());
});

app.get('/', function(req,res){
	res.render('index', {layout : false});
});

app.listen(80);

var users = {};
var games = {};

Io.sockets.on('connection', function(socket){
	user = new User({
		id : socket.id
		,name : "test"
		,send : function(name,args){
			socket.emit(name,args);
		}
	});
	
	users[socket.id] = user;

	socket.on('disconnect',function(){
		//TODO : in game?
		delete users[socket.id];
	});

}); 


