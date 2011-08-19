var Constant = require('./constant');
var Effect = require ('./effect');
var Player = require ('./player');
var Card = require('./card');

exports = module.exports = Game;

function Game (settings){
	//default game settings
	this.turn = 1;
	this.timer = null;
	this.market = null;
	this.players = [];

	//game settings override
	for(var setting in settings){ 
		this[setting] = settings[setting];
	}
	
};

// game start
Game.prototype.start = function () {
	for (var i in players) {
		players[i].send("gameStart");
	}
}
