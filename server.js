var Express = require('express');
var app = module.exports = Express.createServer();

var Util = require('./lib/util');
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
	user.send("welcome");

//	console.log(Util.length(users));

	if(Util.length(users)==2){
		players = [];
		for(var i in users){
			players.push(users[i]);
		}
		game = new Game({
			players : players
			,success : function(){
			}
			,error : function(){
			}
			,complete : function(){
			}
		});

		game.start();

//		games.push(game);

	}
	socket.on('disconnect',function(){
		//TODO : in game?
		delete users[socket.id];
	});

}); 


