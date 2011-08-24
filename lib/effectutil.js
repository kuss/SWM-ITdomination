exports.whenCardExistbyNameinFrontField = function (name){
	return function(state, game, player){
		for (var i in player.front_field){
			if(player.front_field[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinBackField = function (name) {
	return function(state, game, player) {
		for (var i in player.back_field) {
			if (player.back_Field[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinHand = function (name) {
	return function(state, game, player) {
		for (var i in player.hand) {
			if (player.hand[i].proto.name === name || name === undefined || name === null)
				return true;
		}
		return false;
	}
}
exports.whenCardExistbyNameinTomb = function (name) {
	return function(state, game, player) {
		for (var i in player.hand) {
			if (player.tomb[i].proto.name === name || name === undefined || name === null) {
				return true;
			}
		}
		return false;
	}
}
exports.whenCardExistbyNameinDeck = function (name) {
	return function(state, game, player) {
		for (var i in player.deck) {
			if (player.deck[i].proto.name === name || name === undefined || name === null) {
				return true;
			}
		}
		return false;
	}
}
exports.whenPlayerHaveMarket = function () {
	return function(state, game, player) {
		if (game.players[market.own] === player) return true;
		else return false;
	}
}
exports.whenOccisOverThen = function (criteriaOcc) {
	return function(state, game, player) {
		if (game.players[market.own].occ > criteriaOcc) {
			return true;
		}
		else return false;
	}
}
exports.whenOccisEqualto = function (criteriaOcc) {
	return function(state, game, player) {
		if (game.players[market.own].occ === criteriaOcc) {
			return true;
		}
		else return false;
	}
}
exports.increaseCardAttackbyValueinFrontField = function (name, atk) {
	return function(state, game, player){
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].atk += atk;
			}
		}
		return true;
	}
}
exports.increaseCardsAttackbyRateinFrontField = function (name, rate) {
	return function(state, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].atk += player.front_field[i].atk*rate;	
			}
		}
	}
}
exports.increaseCardsHelpAttackbyValueinFrontField = function (name, helpatk) {
	return function(state, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].helpatk += helpatk;
			}
		}
	}
}
exports.increaseCardsHelpAttackbyRateinFrontField = function (name, rate) {
	return function(state, game, player) {
		for (var i in player.front_field) {
			if (player.front_field[i].proto.name === name || name === undefined || name === null) {
				player.front_field[i].helpatk += player.front_field[i].helpatk*rate;
			}
		}
	}
}
exports.cleanEffectsinFrontField = function (name, rate) {
	return function(state, game, player) {
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
