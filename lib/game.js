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

	//각 플레이어에게 id를 붙인다.
	for(var i in players){
		players[i].id = i;
	}

	for(var player in players){ //각 플레이어의 카드에 id를 붙인다. 같은 카드라도 id로 구별가능. 
		for(var index in players[player].deck){
			players[player].deck[index].id = index;
			players[player].deck[index].playerId = players[player].id;
		}
	}
};

/* <Client-Server Protocol Function> - export to server.js & send to client */

Game.prototype.screenfy = function (player) {
	var screen = {};
	var enemy;

	for(var p in this.players){
		if(this.players[p].id != player.id){
			enemy = this.players[p];
			break;
		}
	}

	screen.game = {
		turn : this.turn
		,market : this.market
	};

	screen.hand = [];
	
	for(var i in player.hand){
		screen.hand.push(player.hand[i]);
	}

	screen.enemy = {
		front_field : enemy.front_field
		,back_field : enemy.back_field
	};

	screen.player = {
		occ : player.occ
		,deckCount : player.deck.length
		,tombCount : player.tomb.length
		,money : player.money
		,moneyPerTurn : player.moneyPerTurn
		,front_field : player.front_field
		,back_field : player.back_field
		,attackCost : player.attackCost
	};

	return screen;
}

Game.prototype.sendScreen = function(player) { //player에게 현재 스크린을 업데이트한다. player가 없으면 전체 업데이트 
	if(player == undefined || player == null){
		for (var i in this.players){
			players[i].send("setScreen", this.screenfy(players[i]));
		}
	}
	else{
		player.send("setScreen",this.screenfy(player));
	}
}

/* <Game Status Function> - For export to server.js*/

Game.prototype.gameStart = function () {
	for (var i in this.players) {
		this.players[i].send("gameStart");
	}

	this.sendScreen();

	console.log(this.order);
	console.log(players);
	this.turnStart(players[this.order]);
}

Game.prototype.turnStart = function (player) { //턴 시작! 
	for (rule in player.rules) {
		player.rules[rule] = false;
	}
	player.send("turnStart");
	for (var i in this.players){ //내 턴이 시작할때 다른 플레이어들의 상태는 모두not turn
		this.players[i].state = Constant.state.notTurn;
	}
	player.state = Constant.state.turnStart;

	//덱에서 카드 한장을 가져온다. 
	this.getCardfromDeck(player, null, player);
	
	this.applyEffects();
	this.sendScreen();

	// TIMER 구현을 BACKEND에서?
}

Game.prototype.turnEnd = function (player) {
	if(this.isYourTurn(player)){
		player.state = Constant.state.turnEnd;
		this.applyEffects();
		this.removeTacticCard(player); // turn이 끝났으면 1회용 tacticCard는 날려버리
		this.increaseOcc(player);
		player.send("turnEnd");
		if (this.nextOrder()) this.turnStart(this.players[this.order]);
		else this.gameEnd();
	}
	else
		Util.raiseError("Turn end request failed. not your turn");
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
	player.state = Constant.state.attackEnd;
	applyEffects();
}

Game.prototype.putStart = function (player, cardType) {
	if (cardType === Constant.cardType.product) {
		if (player.rules.oneProductCard) return false;
		// TODO : HAND의 CARD목록을 SOCKET으로 쏴줌
	}
	if (cardType === Constant.cardType.skill) {
	
	}
	if (cardType === Constant.cardType.tactic) {
	
	}
}

Game.prototype.putEnd = function (player, cardType, card) {
	if (cardType === Constant.cardType.product) {
		if (player.rules.oneProductCard) return false;
		this.putProductCard(player, card);
	}
	if (cardType === Constant.cardType.skill) {
		this.putSkillCard(player, card);
	}
	if (cardType === Constant.cardType.tactic) {
		this.putTacticCard(player, card);
	}
	
	player.state = Constant.state.putEnd;
	card.appearTurn = game.turn;
	this.applyEffects();
	this.sendScreen();
}

Game.prototype.selectionEnd = function (player, card) {
}

Game.prototype.gameEnd = function (player) {
	if (player === undefined) { // 승부가 난 경우 gameEnd();
		if (this.turn > Constant.game.maxTurn ) {
			for (var player in players) {
				this.players[player].draw++;
				this.players[player].send("gameDraw");
			}
		}
		else if (this.market !== null && this.market !== undefined) {
			this.players[this.market.own].win++;
			this.players[this.market.own].send("gameWin");
			for (var player in this.players) {
				if (player !== this.market.own) {
					this.players[player].lose++;
					this.players[player].send("gameLose");
				}
			}
		}
		else {
			// market이 null인 상태로 끝났을 경우
			var max = -1;
			var winner;
			for (var player in this.players) {
				if (max < players[player].occ) {
					max = players[player].occ;
					winner = player;
				}
			}
			for (var player in this.players) {
				if (player === winner) {
					this.players[player].win++;
					this.players[player].send("gameWin");
				}
				else {
					this.players[player].lose++;
					this.players[player].send("gameLose");
				}
			}
		}
	}
	else {
		deletebyName(player, this.players); // 게임에서 나간 경우 gameEnd(exitplayer);
		delete player;
		if (Util.length(players)===1) {
			this.players[0].win++;
			this.players[0].send("gameWin");
		}
		else { // 1vs1 mode가 아닌경우
			this.players[market.own].win++;
			this.players[market.own].send("gameWin");
			for (var player in this.players) {
				if (market.own !== player) {
					this.players[player].lose++;
					this.players[player].send("gameLose");
				}
			}
		}
	}
	this.sendScreen();
}

/* </Game Status Function> */

/* <Card Control Fucnction> */
Game.prototype.putProductCard = function (player, card) {
	if (player.rules.oneProductCard) {
		Util.raiseError("You already pick the card");
		return false;
	}
	if (!this.isYourTurn(player)) {
		Util.raiseError("Not Your Turn");
		return false;
	}
	if (Util.length(player.front_field) >= Constant.game.maxFrontFieldCard) {
		Util.raiseError("All Occupied");
		return false;
	}
	else {
		console.log(player);
		console.log(card);
		if (this.useMoney(player, card.cost)) {
			Util.deletebyName(player.hand, card);
			Util.push(player.front_field, card);
			player.rules.oneProductCard = true;
			return true;
		}
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}
}

Game.prototype.putSkillCard = function (player, card) {
	if (!this.isYourTurn(player)) {
		Util.raiseError("Not Your Turn");
		return false;
	}
	if (Util.length(player.back_field) >= Constant.game.maxBackFieldCard) {
		Util.raiseError("All Occupied");
		return false;
	}
	var skillCard = 0;
	for (var i in player.back_field) {
		if (player.back_field[i].type === Constant.cardType.skill) {
			skillCard++;
		}
	}
	if (skillCard >= Constant.game.maxSkillCard) {
		Util.raiseError("All Occupied for Skill Card");
		// TODO : Skill Card의 칸이 꽉 차 있으면 Skill Card 교체
		return false;
	}
	else {
		if (this.useMoney(plyaer, card.cost)) {
			Util.deletebyName(player.hand, card);
			Util.push(player.back_field, card);
			return true;
		}
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}
}

Game.prototype.putTacticCard = function (player, card) {
	if (!this.isYourTurn(player)) {
		Util.raiseError("Not Your Turn");
		return false;
	}
	if (Util.length(player.back_field) >= Constant.game.maxBackFieldCard) {
		Util.raiseError("All Occupied");
		return false;
	}
	var tacticCard = 0;
	for (var i in player.back_field) {
		if (player.back_field[i].type === Constant.cardType.tactic) {
			tacticCard++;
		}
	}
	if (tacticCard >= Constant.game.maxTacticCard) {
		Util.raiseError("All Occupied for Tactic Card");
		return false;
	}
	else {
		if (this.useMoney(plyaer, card.cost)) {
			Util.deletebyName(player.hand, card);
			Util.push(player.back_field, card);
			return true;
		}
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}

}

/*
	GetCardfrom(player, card, other)
	other(혹은 player)의 어떤 card를 찾아 player의 hand에 넘겨준다.
*/
Game.prototype.getCardfromDeck = function (player, card, other) {
	if ((card === undefined || card === null) && (other === undefined || other === null)) {
		var otherIndex = Math.floor(Math.random()*Util.length(players));
		var cardIndex = Math.floor(Math.random()*Util.length(players[other].deck));
		var getcard = players[otherIndex].deck[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyIndex(players[otherIndex].deck, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;
	}
	else if ((card === undefined || card === null)) {
		console.log(player);
		var cardIndex = Math.floor(Math.random()*Util.length(other.deck));
		var getcard = other.deck[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyIndex(other.deck, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;

	}
	else if ((other === undefined || other === null)) {
		cardQueue = [];
		for (var otherIndex in players) {
			for (var cardIndex in players[otherIndex].deck) {
				if (players[otherIndex].deck[cardIndex].proto === card.proto) {
					cardQueue.push(card);
				}
			}
		}
		var RandomIndex = Math.floor(Math.random()*Util.length(cardQueue));
		if (cardQueue[RandomIndex] === null || cardQueue[RandomIndex] === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyProto(this.players[cardQueue[RandomIndex].own].deck, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player.id;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyProto(other.deck, card);
		Util.push(player.hand, card);
		card.own = player.id;
		return true;
	}
}

Game.prototype.getCardfromTomb = function (player, card, other) {
	if ((card === undefined || card === null) && (other === undefined || other === null)) {
		var otherIndex = Math.floor(Math.random()*Util.length(players));
		var cardIndex = Math.floor(Math.random()*Util.length(players[other].tomb));
		var getcard = players[otherIndex].tomb[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyIndex(players[otherIndex].tomb, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;
	}
	else if ((card === undefined || card === null)) {
		console.log(player);
		var cardIndex = Math.floor(Math.random()*Util.length(other.tomb));
		var getcard = other.tomb[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyIndex(other.tomb, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;

	}
	else if ((other === undefined || other === null)) {
		cardQueue = [];
		for (var otherIndex in players) {
			for (var cardIndex in players[otherIndex].tomb) {
				if (players[otherIndex].tomb[cardIndex].proto === card.proto) {
					cardQueue.push(card);
				}
			}
		}
		var RandomIndex = Math.floor(Math.random()*Util.length(cardQueue));
		if (cardQueue[RandomIndex] === null || cardQueue[RandomIndex] === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyProto(this.players[cardQueue[RandomIndex].own].tomb, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player.id;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.shiftbyProto(other.tomb, card);
		Util.push(player.hand, card);
		card.own = player.id;
		return true;
	}
}

Game.prototype.getCardfromHand = function (player, card, other) {
	if ((card === undefined || card === null) && (other === undefined || other === null)) {
		var otherIndex = Math.floor(Math.random()*Util.length(players));
		var cardIndex = Math.floor(Math.random()*Util.length(players[other].hand));
		var getcard = players[otherIndex].hand[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyIndex(players[otherIndex].hand, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;
	}
	else if ((card === undefined || card === null)) {
		console.log(player);
		var cardIndex = Math.floor(Math.random()*Util.length(other.hand));
		var getcard = other.hand[cardIndex];
		if (getcard === null || getcard === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyIndex(other.hand, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player.id;
		return true;

	}
	else if ((other === undefined || other === null)) {
		cardQueue = [];
		for (var otherIndex in players) {
			for (var cardIndex in players[otherIndex].hand) {
				if (players[otherIndex].hand[cardIndex].proto === card.proto) {
					cardQueue.push(card);
				}
			}
		}
		var RandomIndex = Math.floor(Math.random()*Util.length(cardQueue));
		if (cardQueue[RandomIndex] === null || cardQueue[RandomIndex] === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyProto(this.players[cardQueue[RandomIndex].own].hand, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player.id;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyProto(other.hand, card);
		Util.push(player.hand, card);
		card.own = player.id;
		return true;
	}
}


Game.prototype.removeCardfromHand = function (player, card) {
	if ((player === null || player === undefined) && (card === null || card === undefined)) {
		for (var player in players) {
			for (var card in players[player].hand) {
				Util.deletebyIndex(players[player].hand, card);
				Util.push(players[player].tomb, card);
				return true;
			}
		}
	}
	else if (player === null || player === undefined) {
		for (var player in players) {
			Util.deletebyProto(players[player].hand, card);
			Util.push(players[player].tomb, card);
			return true;
		}
	}
	else if (card === null || card === undefined) {
		for (var card in player.hand) {
			Util.deletebyIndex(player.hand, card);
			Util.push(players[player].tomb, card);
			return true;
		}
	}
	else {
		Util.deletebyProto(player.hand, card);
		Util.push(player.tomb, card);
		return true;
	}
	Util.raiseError("No Card in Hand");
	return false;
}

Game.prototype.removeCardfromDeck = function (player, card) {
	if ((player === null || player === undefined) && (card === null || card === undefined)) {
		for (var player in players) {
			for (var card in players[player].deck) {
				Util.deletebyIndex(players[player].deck, card);
				Util.push(players[player].tomb, card);
				return true;
			}
		}
	}
	else if (player === null || player === undefined) {
		for (var player in players) {
			Util.deletebyProto(players[player].deck, card);
			Util.push(players[player].tomb, card);
			return true;
		}
	}
	else if (card === null || card === undefined) {
		for (var card in player.deck) {
			Util.deletebyIndex(player.deck, card);
			Util.push(players[player].tomb, card);
			return true;
		}
	}
	else {
		Util.deletebyProto(player.deck, card);
		Util.push(player.tomb, card);
		return true;
	}
	Util.raiseError("No Card in Hand");
	return false;
}

Game.prototype.removeCardfromMarket = function () {
	if (market === null) {
		Util.raiseError("No Card in Market"); 
		return false;
	}
	this.players[market.own].tomb.push(market);
	market = null;
	return true;
}

Game.prototype.destroyCardfromHand = function (player, card) {
	if ((player === null || player === undefined) && (card === null || card === undefined)) {
		for (var player_i in this.players) {
			for (var card_i in this.players[player_i].hand) {
				delete this.players[player_i].hand[card_i];
				return true;
			}
		}
	}
	else if (player === null || player === undefined) {
		for (var player_i in this.players) {
			for (var card_i in this.players[player_i].hand) {
				if (card.proto === this.players[player_i].hand[card_i].proto) {
					delete this.players[player_i].hand[card_i];
					return true;
				}
			}
		}
	}
	else if (card === null || card === undefined) {
		for (var card_i in player.hand) {
			delete player.hand[card_i];
			return true;
		}
	}
	else {
		for (var card_i in player.hand) {
			if (player.hand[card_i].proto === card.proto) delete card;
			return true;
		}
		Util.raiseError("No Card in Hand");
		return false;
	}
}

Game.prototype.destroyCardfromDeck = function (plyaer, card) {
	if ((player === null || player === undefined) && (card === null || card === undefined)) {
		for (var player_i in this.players) {
			for (var card_i in this.players[player_i].deck) {
				delete this.players[player_i].deck[card_i];
				return true;
			}
		}
	}
	else if (player === null || player === undefined) {
		for (var player_i in this.players) {
			for (var card_i in this.players[player_i].deck) {
				if (card.proto === this.players[player_i].deck[card_i].proto) {
					delete this.players[player_i].deck[card_i];
					return true;
				}
			}
		}
	}
	else if (card === null || card === undefined) {
		for (var card_i in player.deck) {
			delete player.deck[card_i];
			return true;
		}
	}
	else {
		for (var card_i in player.deck) {
			if (player.deck[card_i].proto === card.proto) delete card;
			return true;
		}
		Util.raiseError("No Card in Hand");
		return false;
	}
}

Game.prototype.destroyCardfromMarket = function () {
	if (market === null) {
		Util.raiseError("No Card in Market");
		return false;
	}
	delete market;
	market = null;
	return true;
}

Game.prototype.removeTacticCard = function (player) {
	for (var card in player.back_field) {
		if (player.back_field[card].proto.type === Constant.cardType.tactic) {
			deletebyProto(player.back_field, card);
		}
	}
}

/* </Card Control Function> */

Game.prototype.nextOrder = function () {
	if (this.checkGameOver(this.players[this.order])) return false;
	this.order++;
	if (this.order === Util.length(players)) return this.nextTurn();
	return true;
}

Game.prototype.nextTurn = function () {
	this.turn++;
	this.order = 0;
	if (this.turn > Constant.game.maxTurn) return false;
	return true;
}

Game.prototype.nextmyTurn = function () {
	this.turn++;
}

Game.prototype.attack = function (player, card) {
	if (!this.isYourTurn(player)) {
		Util.raiseError("Not Your Turn!");
		return false;
	}
	if (this.market === null) {
		if (this.useMoney(player, player.attackCost)){
			//market 점령
			Util.deletebyName(player.front_field, card);
			player.send("message", "You got the market!");
		this.market = card;
			return true;
		}
		else {
			Util.raiseError("Not enough money");
			return false;
		}
	}
	if (this.market.own === player.id) {
		Util.raiseError("Already your area");
		return false;
	}
	if (this.useMoney(player, player.attackCost)) {
		console.log("card : ");
		console.log(card);
		this.market.vit -= card.atk;
		//TODO this.getTotalAttack(player, card);
  	if (this.market.vit <= 0) {
			this.players[this.market.own].tomb.push(this.market);
			Util.deletebyName(player.front_field, card);
			this.market = card;
			return true;
		}
		else {
			Util.deletebyName(player.front_field, card);
			player.tomb.push(card);
			return true;
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
	for (var card in player.front_field) {
		totalattack += card.atk * card.roh;
	}
	return totalattack;
}

Game.prototype.useMoney = function (player, money) {
	if (player.money >= money) {
		player.money -= money;
		return true;
	}
	else return false;
}

Game.prototype.applyEffects = function () {
	// TODO
	// 업데이트 되어야 하는 것
	// 플레이어의 턴당 머니
	// 기본 시제품 카드 공격력/수비력
	// 변경된 시제품 카드 공격력/수비력

	// 기본 플레이어 설정
	
	for (var player_i in this.players) {
		players[player_i].moneyPerTurn = Constant.game.moneyPerTurn;
		players[player_i].attackCost = Constant.game.attackCost;
	}
	// 시제품 카드 기본 설정 
	for (var player_i in this.players) {
		for (var card in players[player_i].front_field){
			//set basic property(atk, occ, etc..) for all product card
			players[player_i].front_field[card].atk  = players[player_i].front_field[card].proto.atk;
			players[player_i].front_field[card].helpatk = players[player_i].front_field[card].proto.helpatk;
			players[player_i].front_field[card].cost = players[player_i].front_field[card].proto.cost;
		}
		for (var card in players[player_i].hand) {
			players[player_i].hand[card].cost = players[player_i].hand[card].proto.cost;
		}
	}
	// market카드 기본 설정
/*	this.market.vit = this.market.proto.vit;
	this.market.occ = this.market.proto.occ; */
	
	//효과 적용 
	for (var player_i in this.players) {
		for (var card in players[player_i].front_field) {
			for (var i in players[player_i].front_field[card].proto.effects) {
				if (players[player_i].front_field[card].proto.effects[i].condition(players[player_i].front_field[card], game, players[player_i])) {
					players[player_i].front_field[card].proto.effects[i].affect(players[player_i].front_field[card], game, players[player_i]);
				}
			}
		}
	}
}

Game.prototype.isYourTurn = function(player) {
	for (var i in players) {
		if (players[i].id == player.id) {
			if (this.order == i) return true;
			else return false;
		}
	}
}

Game.prototype.checkGameOver = function(player) {
	if (player.occ >= Constant.game.maxOcc) return true;
	return false;
}

Game.prototype.increaseOcc = function (player) {
	if (this.market === null || this.market === undefined) return false;
	if (player.id === this.market.own) {
		this.players[this.market.own].occ += this.market.occ;
		for (var i in players) {
			if (players[i] !== player) {
				this.players[i].occ -= (this.market.occ / (Util.length(this.players)-1));
			}
		}
	}
}
// 이하 재민 추가

Game.prototype.cardClick = function(player, playerId, cardId){ //현재 상태에서 player가 playerId플레이어의 cardId카드를 눌렀을 때 일어날 효과
	//먼저 cardId의 위치부터 파악하자
	if(player.id == playerId){
		//내 카드를 눌렸을 때 

		if(Util.findCardById(player.front_field, cardId) != null){
			//현재 누른 카드가 프론트 필드에 있다. 
			//그러면 공격한다
			var card = Util.findCardById(player.front_field, cardId);

			if(this.attack(player, card)){
				this.applyEffects();
				this.sendScreen();
			}
		}
		else if(Util.findCardById(player.hand, cardId) != null){ 
			//현재 누른 카드가 패에 있다. (카드 사용)
			//카드의 타입을 보고 해당하는 함수 실행
			var card = Util.findCardById(player.hand, cardId);
			this.putEnd(player, card.proto.type, card);	
			/*
			switch(card.proto.type){
				case Constant.cardType.product :
					if(this.putProductCard(player, card)){
						this.applyEffects();
						this.sendScreen();
					}
					break;
			}
			*/
		}
	}
}
	

	//Chat 관련

Game.prototype.chat = function(text){
	for (var i in this.players){
		this.players[i].send("message", text);
	}
}
