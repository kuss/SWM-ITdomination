var User = require('./user');
var Constant = require ('./constant');
var Card = require('./card');

exports = module.exports = Player;

function Player (settings) {
	this.occ = Constant.game.initOcc;
	this.hand = [];
	this.deck = [];
	this.tomb = [];
	this.front_field = [];
	this.back_field = [];
	this.state = Constant.state.turnEnd;

	this.money = Constant.game.initMoney;
	this.moneyPerTurn = Constant.game.moneyPerTurn;
	
	this.rules = {
		oneProductCard : false
	}

	for (var setting in settings) {
		this[setting] = settings[setting];
	}

}

