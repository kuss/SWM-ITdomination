var Express = require('express');
var App = module.exports = Express.createServer();

var Util = require('./lib/util');
var Io = require('socket.io').listen(App);
var Constant = require('./lib/constant');
var Game = require('./lib/game');
var User = require('./lib/user');
var Player = require('./lib/player');
var ProtoCard = require('./lib/protocard');
var Card = require('./lib/card');
var Lobby = require('./lib/lobby');

function initServer(){
	//add id to all protocards
	for(var i in ProtoCard){
		ProtoCard[i].id = i;
	}
	lobby = new Lobby();
}

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
var lobby;

initServer();

Io.sockets.on('connection', function(socket){	
	user = new User({
		id : socket.id
		,name : "test"
		,send : function(name,args){
			socket.emit(name,args);
		}
		,on : function(name, func){
			socket.on(name, func);
		}
		,removeListener : function(name, func) {
			socket.removeListener(name, func);
		}
	});	

	users[socket.id] = user;
	user.send("welcome"); //socket server connection success
	
	Util.push(lobby.users, user);
	lobby.addLobbyListener(user);	

	if(Util.length(users)==2){
		lobby.addGame(users);
	}

	socket.on('disconnect',function(){
		//TODO : in game?
		delete users[socket.id];
	});

}); 


