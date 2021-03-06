var User = require('./user');
var Constant = require ('./constant');
var Card = require('./card');

exports = module.exports = Player;

function Player (user) {
	this.occ = Constant.game.initOcc;
	this.hand = [];
	this.deck = [];
	this.tomb = [];
	this.front_field = [];
	this.back_field = [];
	this.gameState = Constant.gameState.turnEnd;

	this.money = Constant.game.initMoney;
	this.moneyPerTurn = Constant.game.moneyPerTurn;
	this.attackCost = Constant.game.attackCost;

	this.rules = {
		oneProductCard : false
	}
	this.proto = user;


}

