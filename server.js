var Express = require('express');
var App = module.exports = Express.createServer();

var Util = require('./lib/util');
var Io = require('socket.io').listen(App);
var Constant = require('./lib/constant');
var Game = require('./lib/game');
var User = require('./lib/user');

App.configure(function(){
  App.set('views',__dirname + '/views');
  App.set('view engine','jade');
  App.use(Express.bodyParser());
  App.use(Express.methodOverride());
  App.use(App.router);
  App.use(Express.static(__dirname + '/public'));
  App.use(Express.cookieParser());
});

App.get('/', function(req,res){
	res.render('index', {layout : false});
});

App.listen(80);

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
			var newPlayer = new Player(users[i]);
			players.push(newPlayer);
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


