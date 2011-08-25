var Constant = require('./constant');
var Game = require('./game');
var Card = require('./card');
var Place = require('./place');
var Player = require('./player');
var ProtoCard = require('./protocard');
var Util = require('./util');

exports = module.exports = Lobby;

function Lobby (settings) {
	this.users = [];
	this.games = [];
	this.places = [];

	for (var i in Place) {
		this.places.push(Place[i]);
	}
}
Lobby.prototype.initLobby = function(user) {
	Util.push(this.users, user);
	this.addLobbyListener(user);
	this.movePlace(user, Place[0]);
}
Lobby.prototype.addGame = function(users) {
	var players = [];
	for (var i in users) {
		var newPlayer = new Player(users[i]);
		newPlayer.deck = this.getmyDeck(users[i]);
		players.push(newPlayer);	
		users[i].userState = Constant.userState.playing;
		users[i].gameid = Util.length(this.games);
		Util.shiftbyName(Place[users[i].place].users, users[i]);
		users[i].place = -1;
	}
	var self = this;
	game = new Game({
		players : players
		,success : function() {
			self.destroyGame(game);
		}
		,error : function() {
			self.destroyGame(game);
		}
		,complete : function() {
			self.destroyGame(game);
		}
	});
	// socket on handler는 server.js에서 전부 처리 
	for(var i in players){ 
		this.addGameListener(players[i], game);
	}
	this.games.push(game);
	game.gameStart();
}

Lobby.prototype.destroyGame = function(game) {
	for (var i in game.players) {
		this.removeGameListener(game.players[i]);
		game.players[i].proto.userState = Constant.userState.waiting;
		this.movePlace(game.players[i].proto, Place[0]);
		Util.shiftbyName(game.players, game.players[i]);
		delete game.players[i];
	}
	delete game;
}

var GameHandlers = [
	{
		event : "click"
		,handler : function(player, game){
			return function(playerId, cardId) {
				return game.cardClick(player, playerId, cardId);
			};
		}
	}
	,{
		event : "turnEndRequest"
		,handler : function(player, game) {
			return function(){game.turnEnd(player);};
		}
	}
	,
	{
		event : "chat"
		,handler : function(player, game) {
			return (function(content){game.chat(player.proto.name + " : "+ content);});
		}
	}
];

Lobby.prototype.addGameListener = function (player, game) {
	for (var i in GameHandlers) {
		player.proto.on(GameHandlers[i].event, GameHandlers[i].handler(player, game));	
	}
}

Lobby.prototype.removeGameListener = function (player) {
	for (var i in GameHandlers) {
		user.removeListener(GameHandlers[i].event, GameHandlers[i].handler);
	}
}

Lobby.prototype.addLobbyListener = function (user) {
	var lobby = this;

	user.on("moveLocationRequest", function(){
		//랜덤하게 다른곳으로 한번 이동하면 무조건 적대지역으로 간다.
		var r;
		while(true){
			r=Math.floor(Math.random() * Place.length);
			if(Place[r].placeType == Constant.placeType.fight)
				break;
		}
		lobby.movePlace(user, Place[r]);
	});

	user.on("lobbyChat", function(content){
		lobby.broadcast(user.place, "lobbyLog", user.nameFormat() + " : "+ content );
	});
}

Lobby.prototype.removeLobbyListener = function (user) {
	user.removeListener("moveLocationRequest");
	user.removeListener("lobbyChat");
}

Lobby.prototype.getmyDeck = function(user) {
	var deck = [];
	/*
	for (var i=0;i<Constant.game.maxDeck;i++) {
		deck.push(new Card(ProtoCard[Math.floor(Math.random()*Util.length(ProtoCard))]));
	}
	*/
	for (var i=0;i<=20;i++) {
		deck.push(new Card(ProtoCard[i]));
	}
	return deck;
}
Lobby.prototype.movePlace = function (user, place) {
	if (user.place !== -1){
		this.broadcast(user.place, "lobbyLog", user.nameFormat() + " 님께서 이동 하셨습니다.");
		Util.shiftbyName(Place[user.place].users, user);
	}
	Util.push(place.users, user);
	user.place = place.id;
	
	user.send("setLocation", {name : Place[user.place].name, placeType : Place[user.place].placeType, image : Place[user.place].image}); 
	this.broadcast(user.place, "lobbyLog", user.nameFormat() + " 님께서 참가 하셨습니다.");

	if (place.placeType == Constant.placeType.fight && this.checkFind(user, place)) {
		var users = [];
		users.push(user);
		users.push(this.findOther(user, place));
		this.addGame(users);
	}
}
Lobby.prototype.removeUser = function (user) {
	Util.shiftbyName(Place[user.place], user);
	Util.deletebyName(this.users, user);	

	if (user.userState === Constant.userState.playing) {
		for (var player in this.games[user.gameid].players) {
			if (this.games[user.gameid].players[player].proto === user) {
				this.games[user.gameid].gameEnd(this.games[user.gameid].players[player]);
			}
		}
	}
}
Lobby.prototype.checkFind = function (user, place) {
	console.log("CHECKCKCKCKCFIFIFINDNDND");
	console.log(place.users);
	if (Util.length(place.users)>=2) return true;
	else return false;
}
Lobby.prototype.findOther = function (user, place) {
	return place.users[Math.floor(Math.random()*(Util.length(place.users)-1))];
}

Lobby.prototype.broadcast = function(index, name, a,b,c){
	if(typeof index == "string"){ //broadcast all lobby
	}
	else //broadcast one place
	{
		for(var i in Place[index].users){
			Place[index].users[i].send(name,a,b,c);
		}
	}
}
