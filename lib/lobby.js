var Constant = require('./constant');
var Game = require('./game');
var Card = require('./card');
var Place = require('./place');

exports = module.exports = Lobby;

var Lobby = function () {
	var users = [];
	var games = [];
	var places = [];
	
	for (var i in Place) {
		places.push(Place[i]);
	}
}

Lobby.prototype.addGame(users) {
	var players = [];
	for (var i in users) {
		var newPlayer = newPlayer(users[i]);
		newPlayer.deck = this.getmyDeck(users[i]);
		players.push(newPlayer);	
	}
	game = new Game(){
		players : players;
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
	game.gameStart();
}
Lobby.prototype.destroyGame(game) {
	delete game;
}

Lobby.prototype.getmyDeck(user) {

}
