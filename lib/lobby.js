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

Lobby.prototype.addGame = function(users) {
	var players = [];
	for (var i in users) {
		var newPlayer = new Player(users[i]);
		newPlayer.deck = this.getmyDeck(users[i]);
		players.push(newPlayer);	
	}
	console.log(players);
	game = new Game({
		players : players
		,success : function() {
			this.destroyGame(game);
		}
		,error : function() {
			this.destroyGame(game);
		}
		,complete : function() {
			this.destroyGame(game);
		}
	});
	// socket on handler는 server.js에서 전부 처리 
	for(var i in players){ 
		this.addGameListener(players[i], game);
	}
	game.gameStart();
}

Lobby.prototype.destroyGame = function(game) {
	for (var i in game.players) {
		this.removeGameListener(game.players[i].proto);
		this.addLobbyListener(game.players[i].proto);
		delete game.players[i];
	}
	delete game;
}

Lobby.prototype.addGameListener = function (player, game) {
	player.proto.on("click", function(playerId, cardId) {
		game.cardClick(player, playerId, cardId);
	});
	player.proto.on("turnEndRequest", function() {
		game.turnEnd(player);	
	});
	player.proto.on("chat", function(content) {
		game.chat(content);
	});
}

Lobby.prototype.removeGameListener = function (user) {
	user.removeListener("click");
	user.removeListener("turnEndRequiest");
	user.removeListener("chat");
}

Lobby.prototype.addLobbyListener = function (user) {
}

Lobby.prototype.removeLobbyListener = function (user) {
}

Lobby.prototype.getmyDeck = function(user) {
	var deck = [];
	for (var i=0;i<Constant.game.maxDeck;i++) {
		deck.push(new Card(ProtoCard[Math.floor(Math.random()*Util.length(ProtoCard))]));
	}
	return deck;
}
Lobby.prototype.movePlace = function (user, place) {
	Util.removebyName(Place[user.place].users, user);
	Util.push(place.users, user);
	user.place = place.id;
}
