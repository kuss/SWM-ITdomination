exports.hasExpired = function (continueTurn) {
	return function(card, game, player){
		if (continueTurn === 0) {
			return false;
		}
		else if (game.turn - card.appearTurn >= continueTurn) {
			console.log(game.turn);
			console.log(card.appearTurn);
			console.log(continueTurn);
			console.log("return true");
			return true;
		}
		else return false;
	}
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
exports.whenPlayerHaveMarket = function () {
	return function(card, game, player) {
		if (game.players[market.own] === player) return true;
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
exports.increaseCardsAttackbyRateinFrontField = function (name, rate) {
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
exports.cleanEffectsinFrontField = function (name, rate) {
	return function(card, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name===undefined || name === null) {
				player.front_field[i].atk = player.front_field[i].proto.atk;
				player.front_field[i].vit = player.front_field[i].proto.vit;
				player.front_field[i].occ = player.front_field[i].proto.occ;
				player.front_field[i].cost = player.front_field[i].proto.cost;
			}
		}
	}
}
exports.myTurnEnd = function () {
	return function(card, game, player) {
		game.turnEnd(player);
	}
}
exports.giveMoneybyValue = function (value) {
	return function(card, game, player) {
		player.money += value;
	}
}
exports.giveMoneybyRate = function (rate) {
	return function(card, game, player) {
		player.money += player.money * rate;
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
