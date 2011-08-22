var Constant = require('./constant');
var Effect = require ('./effect');
var Player = require ('./player');
var Card = require('./card');
var Util = require('./util');


exports = module.exports = Game;

function Game (settings){
	//default game settings
	this.turn = 1;
	this.order = 0;
	this.timer = null;
	this.market = null;
	this.players = [];

	//game settings override
	for(var setting in settings){ 
		this[setting] = settings[setting];
	}
	
};

/* <game status function> 실제 server.js에서 사용하는 함수들 */
Game.prototype.gameStart = function () {
	for (var i in players) {
		players[i].send("gameStart");
	}
}

Game.prototype.turnStart = function (player, card) {
	applyEffects();
}

Game.prototype.turnEnd = function (player, card) {
	applyEffects();
	if (nextOrder()) turnStart();
	else gameEnd();
}

Game.prototype.attackStart = function (player, card) {
	if (attack(player, card)) {
		// TODO : attack에 성공
	}
	else {
		// TODO : attack에 실패
	}
	attackEnd();
}

Game.prototype.attackEnd = function (player, card) {
	applyEffects();
}

Game.prototype.putStart = function (player, card) {
	
}

Game.prototype.putEnd = function (player, card) {
	applyEffects();
}

Game.prototype.selectionEnd = function (player, card) {
}

Game.prototype.gameEnd = function (player) {
	if (player === undefined) {
		/* 승부가 난 경우, gameEnd() */
		if (occ === maxOcc / Util.length(players)) {
			for (var player in players) {
				players[player].draw++;
			}
		}
		else {
			market.own.win++;
			for (var player in players) {
				if (players[player] !== market.own) {
					players[player].lose++;
				}
			}
		}
	}
	else {
		/* 게임중인 사람이 나간경우, gameEnd(exit_player); */
		deletebyName(player, players);
		delete player;
		if (Util.length(players)===1) {
			players[0].win++;
		}
		else {
			/* 1vs1 mode가 아닐 경우 제일 점유율이 높은 사람이 승리 */
			market.own.win++;
			for (var player in players) {
				if (market.own !== players[player]) players[player].lose++;
			}
		}
	}
}

/* </game status function> */

Game.prototype.nextOrder = function () {
	this.order++;
	if (this.order === Util.length(players)) return nextTurn();
	return true;
}

Game.prototype.nextTurn = function () {
	if (checkGameOver()) return false;
	else {
		this.turn++;
		this.order = 0;
		return true;
	}
	if (turn > Constant.game.maxTurn) return false;
}

Game.prototype.nextmyTurn = function () {
	this.turn++;
}

Game.prototype.attack = function (player, card) {
	if (!isYourTurn(player)) {
		Util.raiseError("Not Your Turn!");
		return false;
	}
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
	if (!isYourTurn(player)) {
		Util.raiseError("Not Your Turn");
		return false;
	}
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

Game.prototype.removeCardfromHand = function (player, card) {
	if (player === null) {
		for (var player in players) {
			Util.deletebyName(player.hand, card);
			player.tomb.push(card);
			return true;
		}
	}
	else {
		Util.deletebyName(player.hand, card);
		player.tomb.push(card);
		return true;
	}
	Util.raiseError("No Card in Hand");
	return false;
}

Game.prototype.removeCardfromDeck = function (player, card) {
	if (player === null) {
		for (var player in players) {
			Util.deletebyName(player.deck, card);
			player.tomb.push(card);
			return true;
		}
	}
	else {
		Util.deletebyName(player.deck, card);
		player.tomb.push(card);
		return true;
	}
	Util.raiseError("No Card in Deck");
	return false;
}

Game.prototype.removeCardfromMarket = function () {
	if (market == null) {
		Util.raiseError("No Card in Market"); 
		return false;
	}
	market.own.tomb.push(market);
	market = null;
	return true;
}

Game.prototype.destroyCardfromHand = function (player, card) {
	for (var i_card in player.hand) {
		if (i_card === card) delete card;
		return true;
	}
	Util.raiseError("No Card in Hand");
	return false;
}

Game.prototype.destroyCardfromDeck = function (plyaer, card) {
	for (var i_card in player.deck) {
		if (i_card === card) delete card;
		return true;
	}
	Util.raiseError("No Card in Deck");
	return false;
}

Game.prototype.destroyCardfromMarket = function () {
	if (market == null) {
		Util.raiseError("No Card in Market");
		return false;
	}
	delete market;
	market = null;
	return true;
}

Game.prototype.isYourTurn = function(player) {
	for (var i in players) {
		if (players[i] === player) {
			if (this.order === i) return true;
			else return false;
		}
	}
}

Game.prototype.checkGameOver = function() {
	if (this.occ >= Constant.game.maxOcc) return true;
	return false;
}
