var Util = require('./util');

exports.hasExpired = function (continueTurn) {
	return function(card, game, player){
		if (continueTurn < 0) {
			return false;
		}
		else if (game.turn - card.appearTurn >= continueTurn) {
			return true;
		}
		else return false;
	}
}
exports.randomly = function (rate) {
	if (Math.random() <= rate) {
		return true;
	}
	else return false;
}
exports.whenCardExistbyNameinFrontField = function (name){
	return function(card, game, player){
		for (var i in player.front_field){
			if(player.front_field[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinBackField = function (name) {
	return function(card, game, player) {
		for (var i in player.back_field) {
			if (player.back_Field[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinHand = function (name) {
	return function(card, game, player) {
		for (var i in player.hand) {
			if (player.hand[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinTomb = function (name) {
	return function(card, game, player) {
		for (var i in player.hand) {
			if (player.tomb[i].proto.name === name || name === undefined || name === null) {
				return true;
			}
		}
		return false;
	}
}
exports.whenCardExistbyNameinDeck = function (name) {
	return function(card, game, player) {
		for (var i in player.deck) {
			if (player.deck[i].proto.name === name || name === undefined || name === null) {
				return true;
			}
		}
		return false;
	}
}
exports.whenCardExistbyNameinMarket = function (name) {
	return function(card, game, player) {
		if (game.market.proto.name === name) return true;
		else return false;
	}
}
exports.whenPlayerHaveMarket = function () {
	return function(card, game, player) {
		if (game.market == null || game.market == undefined)return false;
		if (game.market.own == player.id) return true;
		else return false;
	}
}
exports.whenOccisOverThen = function (criteriaOcc) {
	return function(card, game, player) {
		if (game.players[market.own].occ > criteriaOcc) {
			return true;
		}
		else return false;
	}
}
exports.whenOccisLessThen = function (criteriaOcc) {
	return function(card, game, player) {
		if (game.players[market.own].occ < criteriaOcc) {
			return true;
		}
		else return false;
	}
}
exports.whenOccisEqualto = function (criteriaOcc) {
	return function(card, game, player) {
		if (game.players[market.own].occ === criteriaOcc) {
			return true;
		}
		else return false;
	}
}
exports.increaseCardAttackbyValueinFrontField = function (name, atk) {
	return function(card, game, player){
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].atk += atk;
			}
		}
		return true;
	}
}
exports.increaseOtherCardAttackbyValueinFrontField = function (name, atk) {
	return function(card, game, player) {
		for (var i in game.players) {
			if (player !== game.players[i]) {
				for (var j in game.players[i].front_field) {
					if (game.players[i].front_field[j].proto.name === name || name === undefined || name === null) {
						game.players[i].front_field[j].atk += atk;
					}
				}
			}
		}
	}
}
exports.increaseCardAttackbyRateinFrontField = function (name, rate) {
	return function(card, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].atk += player.front_field[i].atk*rate;	
			}
		}
	}
}
exports.increaseCardsHelpAttackbyValueinFrontField = function (name, helpatk) {
	return function(card, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].helpatk += helpatk;
			}
		}
	}
}
exports.increaseCardsHelpAttackbyRateinFrontField = function (name, rate) {
	return function(card, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].helpatk += player.front_field[i].helpatk*rate;
			}
		}
	}
}
exports.increaseOccbyValue = function (value) {
	return function(card, game, player) {
		player.occ += value;
		for (var i in game.players) {
			if (game.players[i] !== player) {
				game.players[i].occ -= value / (Util.length(game.players)-1);
			}
		}
	}
}
exports.increaseOccbyRate = function (rate) {
	return function(card, game, player) {
		player.occ += player.occ * rate;
		for (var i in game.players) {
			if (game.players[i] !== player) {
				game.players[i].occ -= player.occ * rate / (Util.length(game.players)-1);
			}
		}
	}
}
exports.increaseVitbyValue = function(value) {
	return function(card, game, player){
		game.market.vit += value;
		if(game.market.vit > game.market.proto.vit)
			game.market.vit = game.market.proto.vit;
	};
}

exports.cleanEffectsinFrontField = function (name, rate) {
	return function(card, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name===undefined || name === null) {
				for (var effect in player.front_field[i].effects) {
					player.front_field[i].effects[effect].cotinueTurn = 0;
				}
			}
		}
	}
}
exports.cleanEffectsinOtherFrontField = function (name, rate) {
	return function(card, game, player) {
		for (var i in game.players) {
			if (game.players[i] !== player) {
				for (var card in game.players[i].front_field) {
					for (var effect in game.players[i].front_field[card]) {
						game.players[i].front_field[card].effects[effect].continueTurn = 0;
					}
				}
			}
		}
	}
}
exports.myTurnEnd = function () {
	return function(card, game, player) {
		game.turnEnd(player);
	}
}
exports.myTurnAgain = function () {
	return function(card, game, player) {
		game.nextmyTurn();
	}
}
exports.giveMoneybyValue = function (value) {
	return function(card, game, player) {
		player.money += value;
	}
}
exports.giveMoneybyValuetoOther = function (value) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player) {
				game.players[player_i].money += value;
			}
		}
	}
}
exports.giveMoneybyRate = function (rate) {
	return function(card, game, player) {
		player.money += player.money * rate;
	}
}
exports.giveMoneybyRatetoOther = function (rate) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player) {
				game.players[player_i].money += game.players[player_i].money * rate;
			}
		}
	}
}
exports.giveOccbyValue = function (value) {
	return function(card, game, player) {
		player.occ += value;
	}
}
exports.giveOccbyRate = function (rate) {
	return function(card, game, player) {
		player.occ += player.occ * rate;
	}
}
exports.increaseMoneyPerTurnbyValue = function (value) {
	return function(card, game, player) {
		player.moneyPerTurn += value;
	}
}
exports.increaseMoneyPerTurnbyRate = function (rate) {
	return function(card, game, player) {
		player.moneyPerTurn += player.moneyPerTurn*rate;
	}
}
exports.setMoneyPerTurnbyValue = function (value) {
	return function(card, game, player) {
		player.moneyPerTurn = value;
	}
}
exports.setMoneyPerTurnbyValuetoOther = function (value) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player) {
				game.players[player_i].moneyPerTurn = value;
			}
		}
	}
}
exports.increaseCostbyValue = function (value, targetcard) {
}
exports.increaseCostbyValuetoOther = function (value, targetcard) {
}
exports.increaseCostbyRate = function (rate, targetcard) {
}
exports.increaseCostbyRatetoOther = function (rate, targetcard) {
}
exports.setCostbyValue = function (value, targetcard) {
}
exports.setCostbyValuetoOther = function (value, targetcard) {
}
exports.removeCardfromMarket = function () {
	return function(card, game, player) {
		game.removeCardfromMarket();
	}
}
exports.removeCardfromHand = function (target) {
	return function(card, game, player) {
		for (var card in player.hand) {
			if (target === undefined || target === null) {
				game.removeCardfromHand(player, null);
			}
			else if (card.proto.name === target.proto.name) {
				game.removeCardfromHand(player, target);
			}
		}
	}
}
exports.removeCardfromOtherHand = function (target) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player || player === null || player === undefined) {
				for (var card_i in game.players[player_i].hand) {
					if (target === null || target === undefined) {
						game.removeCardfromHand(game.players[player_i], null);
					}
					else if (game.players[player_i].hand[card_i].proto.name === target.proto.name) {
						game.removeCardfromHand(game.players[player_i], target);
					}
				}
			}	
		}
	}
}
exports.removeCardfromDeck = function (target) {
	return function(card, game, player) {
		for (var card in player.deck) {
			if (target === undefined || target === null) {
				game.removeCardfromDeck(player, null);
			}
			else if (card.proto.name === target.proto.name) {
				game.removeCardfromDeck(player, target);
			}
		}
	}
}
exports.removeCardfromOtherDeck = function (target) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player || player === null || player === undefined) {
				for (var card_i in game.players[player_i].deck) {
					if (target === null || target === undefined) {
						game.removeCardfromDeck(game.players[player_i], null);
					}
					else if (game.players[player_i].deck[card_i].proto.name === target.proto.name) {
						game.removeCardfromDeck(game.players[player_i], target);
					}
				}
			}	
		}
	}
}
exports.destroyCardfromHand = function (target) {
	return function(card, game, player) {
		for (var card in player.hand) {
			if (target === undefined || target === null) {
				game.destroyCardfromHand(player, null);
			}
			else if (card.proto.name === target.proto.name) {
				game.destroyCardfromHand(player, target);
			}
		}
	}
}
exports.destroyCardfromOtherHand = function (target) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player || player === null || player === undefined) {
				for (var card_i in game.players[player_i].hand) {
					if (target === null || target === undefined) {
						game.destroyCardfromHand(game.players[player_i], null);
					}
					else if (game.players[player_i].hand[card_i].proto.name === target.proto.name) {
						game.destroyCardfromHand(game.players[player_i], target);
					}
				}
			}	
		}
	}
}
exports.destroyCardfromDeck = function (target) {
	return function(card, game, player) {
		for (var card in player.deck) {
			if (target === undefined || target === null) {
				game.destroyCardfromDeck(player, null);
			}
			else if (card.proto.name === target.proto.name) {
				game.destroyCardfromDeck(player, target);
			}
		}
	}
}
exports.destroyCardfromOtherDeck = function (target) {
	return function(card, game, player) {
		for (var player_i in game.players) {
			if (game.players[player_i] !== player || player === null || player === undefined) {
				for (var card_i in game.players[player_i].deck) {
					if (target === null || target === undefined) {
						game.destroyCardfromDeck(game.players[player_i], null);
					}
					else if (game.players[player_i].deck[card_i].proto.name === target.proto.name) {
						game.destroyCardfromDeck(game.players[player_i], target);
					}
				}
			}	
		}
	}
}
exports.removeCardfromMarket = function () {
	return function(card, game, player) {
		game.removeCardfromMarket();
	}
}
exports.destroyCardfromMarket = function () {
	return function(card, game, player) {
		game.destroyCardfromMarket();
	}
}
exports.putCardtoMarket = function (target) {
	return function(card, game, player) {
		game.market = target;
	}
}
/*TODO : CardName을 받아 비교하는 부분이 필요함*/
exports.getCardfromDeck = function (targetcard) {
	return function(card, game, player) {
		for (var i in player.deck) {
			if (player.deck[i].proto.name === name || name === undefined || name === null)
				game.getCardfromDeck(player, player.deck[i], player);
		}
	}
}
exports.getCardfromOterDeck = function (targetcard) {
	return function(card, game, player) {
		game.getCardfromDeck(player, card);
	}
}
exports.getRandomCardfromDeck = function () {
	return function(card, game, player) {
		game.getCardfromDeck(player, null, player);
	}
}
exports.getRandomCardfromOtherDeck = function () {
	return function(card, game, player) {
		game.getCardfromDeck(player, null, null);
	}
}
exports.getCardfromHand = function (targetcard) {
	return function(card, game, player) {
		game.getCardfromHand(player, targetcard, player);
	}
}
exports.getCardfromOterHand = function (targetcard) {
	return function(card, game, player) {
		game.getCardfromHand(player, card);
	}
}
exports.getRandomCardfromHand = function () {
	return function(card, game, player) {
		game.getCardfromHand(player, null, player);
	}
}
exports.getRandomCardfromOtherHand = function () {
	return function(card, game, player) {
		game.getCardfromHand(player, null, null);
	}
}
exports.getCardfromTomb = function (targetcard) {
	return function(card, game, player) {
		game.getCardfromTomb(player, targetcard, player);
	}
}
exports.getCardfromOterTomb = function (targetcard) {
	return function(card, game, player) {
		game.getCardfromTomb(player, card);
	}
}
exports.getRandomCardfromTomb = function () {
	return function(card, game, player) {
		game.getCardfromTomb(player, null, player);
	}
}
exports.getRandomCardfromOtherTomb = function () {
	return function(card, game, player) {
		game.getCardfromTomb(player, null, null);
	}
}
exports.seeOtherCard = function () {
}
exports.cancelAttack = function () {
}
exports.oneMoreProductCard = function () {
}
