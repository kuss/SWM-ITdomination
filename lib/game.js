var Constant = require('./constant');
var Effect = require ('./effect');

module.exports = function(settings){
	//default game settings
	this.turn = 1;
	this.timer = null;

	//game settings override
	for(var setting in settings){ 
		this[setting] = settings[setting];
	}
	
	//player settings
	for(var p in players){
//		players[p].
	}

	//game start message broadcast
	this.start = function(){
		for(var i in players){
			players[i].send("gameStart");
		}
	}
};
