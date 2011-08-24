var Constant = require('./constant');
var Game = require('./game');
var Card = require('./card');
var Place = require('./place');

exports = module.exports = Lobby;

function Lobby (settings) {
	var users = [];
	var games = [];
	var places = [];
	
	for (var i in Place) {
		places.push(Place[i]);
	}
}

Lobby.prototype.addGame = function(users) {
	var players = [];
	for (var i in users) {
		var newPlayer = newPlayer(users[i]);
		newPlayer.deck = this.getmyDeck(users[i]);
		players.push(newPlayer);	
	}
	game = new Game()({
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
		(function(player_i){
			player_i.on("click",function(playerId, cardId){ //카드 클릭 이벤트 등록 
				game.cardClick(player_i, playerId, cardId);
			});

			player_i.on("turnEndRequest",function(){
				game.turnEnd(player_i);
			});

			player_i.on("chat", function(content){
				game.chat(content);
			});
				
		})(players[i]);
	}
	game.gameStart();
}
Lobby.prototype.destroyGame = function(game) {
	for (var i in game.players){
		(function(player_i) {
			player_i.removeListener("click");
			player_i.removeListener("turnEndRequest");
			player_i.removeListener("chat");
		})(game.players[i]);
	}
	for (var i in game.players) {
		this.addLobbyListener(game.players[i].proto);
		delete game.players[i];
	}
	delete game;
}
Lobby.prototype.addLobbyListener = function (user) {
	
}

Lobby.prototype.getmyDeck = function(user) {

}
