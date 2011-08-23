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

function initServer(){
	//add id to all protocards
	for(var i in ProtoCard){
		ProtoCard[i].id = i;
	}
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
	});	

	users[socket.id] = user;
	user.send("welcome"); //socket server connection success

//	console.log(Util.length(users));

	if(Util.length(users)==2){
		players = [];
		for(var i in users){
			var newPlayer = new Player(users[i]);
			
			newPlayer.deck = [new Card(ProtoCard[0]), new Card(ProtoCard[0]), new Card(ProtoCard[0]), new Card(ProtoCard[0]), new Card(ProtoCard[0])
			]; //TODO : 테스트를 위한 덱 설정이므로 지울것 

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

		for(var i in players){ 
			(function(player_i){
				player_i.on("click",function(playerId, cardId){ //카드 클릭 이벤트 등록 
					game.cardClick(player_i, playerId, cardId);
				});

				player_i.on("turnEndRequest",function(){
					game.turnEnd(player_i);
				});
				
			})(players[i]);
		}

		game.gameStart();
	}

	socket.on('disconnect',function(){
		//TODO : in game?
		delete users[socket.id];
	});

}); 


