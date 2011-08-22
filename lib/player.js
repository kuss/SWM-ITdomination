var User = require('./user');
var Constant = require ('./constant');
var Card = require('./card');

exports = module.exports = Player;

function Player (settings) {
	var occ = 50;
	var hand = [];
	var deck = [];
	var tomb = [];
	var field = [];

	var money = Constant.game.initMoney;
	var moneyPerTurn = Constant.game.moneyPerTurn;
	
	var rules = {
		oneProductCard : false;
	}

	for (var setting in settings) {
		this[setting] = settings[setting];
	}
}

Player.prototype.__proto__ = User.prototype;

