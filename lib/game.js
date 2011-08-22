var Constant = require('./constant');
var Effect = require ('./effect');
var Player = require ('./player');
var Card = require('./card');
var Util = require('./util');


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

Game.prototype.nextTurn = function () {
	this.turn++;
}

Game.prototype.nextmyTurn = function () {
	this.turn += Util.length(players);
}

Game.prototype.attack = function (player, card) {
	if (this.market === null) {
		if (useMoney(player, card.cost))	return true;
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}
	if (this.market.own === player) {
		Util.raiseError("Already your area");
		return false;
	}
	if (useMoney(player, card.cost)) {
		this.market.vit -= getTotalAttack(player, card);
  	if (this.market.vit <= 0) {
			this.market.own.tomb.push(this.market);
			Util.deletebyName(player.field, card);
			this.market = card;
			return true;
		}
		else {
			Util.deletebyName(player.field, card);
			return false;
		}
	}
	else {
		Util.raiseError("Not enough money");
		return false;
	}
}

Game.prototype.getTotalAttack = function (player, card) {
	var totalattack;
	totalattack = card.atk;
	for (var card in player.field) {
		totalattack += card.atk * card.roh;
	}
	return totalattack;
}

Game.prototype.putProductCard = function (player, card) {
	// TODO : STATE CHECK (NOT PUT 2 CARDS in 1 TURN)
	if (Util.length(player.field) >= Constant.game.maxFieldCard) {
		Util.raiseError("All Occupied");
		return false;
	}
	else {
		if (useMoney(player, card.cost)) {
			Util.deletebyName(player.hand, card);
			player.field.push(card);
			return true;
		}
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}
}

Game.prototype.putSkillCard = function (player, card) {
}

Game.prototype.putTacticCard = function (player, card) {
}

Game.prototype.useMoney = function (player, money) {
	if (player.money >= money) {
		player.money -= money;
		applyEffects(); // 사실상 돈이 쓰였다는 것은 카드가 올라갔다는 것을 의미함. 따라서 여기서 Effect를 적용시키면 카드를 올려놓는 경우나 공격하는 모든 경우에 대해 처리가 가능하다.
		return true;
	}
	else return false;
}

Game.prototype.applyEffects = function () {
	for (var player in this.players) {
		for (var card in player.hand) {
			// TODO : apply card.Effect
		}
	}
}
