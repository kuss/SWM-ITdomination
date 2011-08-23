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

	screen.game = {
		turn : this.turn
	};

	screen.hand = [];
	for(var i in player.hand){
		screen.hand.push(player.hand[i]);
	}
	screen.enemy = {};
	screen.player = {
		occ : player.occ
		,deckCount : player.deck.length
		,money : player.money
		,moneyPerTurn : player.moneyPerTurn
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

	//덱에서 카드 한장을 가져온다. 
	this.getCardfromDeck(player, null, player);
	
	this.applyEffects();
	this.sendScreen();

	// TIMER 구현을 BACKEND에서?
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
		putProductCard(player, card);
	}
	if (cardType === Constant.cardType.skill) {
		putSkillCard(player, card);
	}
	if (cardType === Constant.cardType.tactic) {
		putTacticCard(player, card);
	}
	
	applyEffects();
}

Game.prototype.selectionEnd = function (player, card) {
}

Game.prototype.gameEnd = function (player) {
	if (player === undefined) { // 승부가 난 경우 gameEnd();
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
		deletebyName(player, players); // 게임에서 나간 경우 gameEnd(exitplayer);
		delete player;
		if (Util.length(players)===1) {
			players[0].win++;
		}
		else { // 1vs1 mode가 아닌경우
			market.own.win++;
			for (var player in players) {
				if (market.own !== players[player]) players[player].lose++;
			}
		}
	}
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
	if (Util.length(player.field) >= Constant.game.maxFieldCard) {
		Util.raiseError("All Occupied");
		return false;
	}
	else {
		if (this.useMoney(player, card.cost)) {
			Util.deletebyName(player.hand, card);
			Util.push(player.front_field, card);
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

/*
	GetCardfrom(player, card, other)
	other(혹은 player)의 어떤 card를 찾아 player의 hand에 넘겨준다.
	TODO : deletebyName 호출 시 protocard를 비교해 주어야 함 (이로 인해 아래의 함수들 동작 안할수 있음)
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
		Util.deletebyIndex(players[otherIndex].deck, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player;
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
		Util.deletebyIndex(other.deck, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player;
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
		Util.deletebyName(cardQueue[RandomIndex].own.deck, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyName(other.deck, card);
		Util.push(player.hand, card);
		card.own = player;
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
		Util.deletebyIndex(players[otherIndex].tomb, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player;
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
		Util.deletebyIndex(other.tomb, cardIndex);
		Util.push(player.hand, getcard);
		getcard.own = player;
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
		Util.deletebyName(cardQueue[RandomIndex].own.tomb, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyName(other.tomb, card);
		Util.push(player.hand, card);
		card.own = player;
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
		getcard.own = player;
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
		getcard.own = player;
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
		Util.deletebyName(cardQueue[RandomIndex].own.hand, cardQueue[RandomIndex]);
		Util.push(player.hand, cardQueue[RandomIndex]);
		getcard.own = player;
		return true;
	}
	else {
		if (card === null || card === undefined) {
			Util.raiseError("Nothing is selected");
			return false;
		}
		Util.deletebyName(other.hand, card);
		Util.push(player.hand, card);
		card.own = player;
		return true;
	}
}


Game.prototype.removeCardfromHand = function (player, card) {
	if (player === null) {
		for (var player in players) {
			Util.deletebyName(players[player].hand, card);
			Util.push(player.tomb, card);
			return true;
		}
	}
	else {
		Util.deletebyName(player.hand, card);
		Util.push(player.tomb, card);
		return true;
	}
	Util.raiseError("No Card in Hand");
	return false;
}

Game.prototype.removeCardfromDeck = function (player, card) {
	if (player === null) {
		for (var player in players) {
			Util.deletebyName(players[player].deck, card);
			Util.push(player.tomb, card);
			return true;
		}
	}
	else {
		Util.deletebyName(player.deck, card);
		Util.push(player.tomb, card);
		return true;
	}
	Util.raiseError("No Card in Deck");
	return false;
}

Game.prototype.removeCardfromMarket = function () {
	if (market === null) {
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
	if (market === null) {
		Util.raiseError("No Card in Market");
		return false;
	}
	delete market;
	market = null;
	return true;
}

/* </Card Control Function> */

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
	
	for (var player in this.players) {
		players[player].moneyPerTurn = Constant.game.moneyPerTurn;
	}
	// 시제품 카드 기본 설정 
	for (var player in this.players) {
		for (var card in players[player].front_field){
			//set basic property(atk, occ, etc..) for all product card
			players[player].front_field[card].atk  = players[player].front_field[card].proto.atk;
			players[player].front_field[card].helpatk = players[player].front_field[card].proto.helpatk;
			players[player].front_field[card].cost = players[player].front_field[card].proto.cost;
		}
		for (var card in players[player].hand) {
			players[player].hand[card].cost = players[player].hand[card].proto.price;
		}
	}
	// market카드 기본 설정
/*	this.market.vit = this.market.proto.vit;
	this.market.occ = this.market.proto.occ; */
	
	//효과 적용 
	for (var player in this.players) {
		for (var card in player.hand) {
			// TODO : apply card.Effect
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

Game.prototype.checkGameOver = function() {
	if (this.occ >= Constant.game.maxOcc) return true;
	return false;
}


// 이하 재민 추가

Game.prototype.cardClick = function(player, playerId, cardId){ //현재 상태에서 player가 playerId플레이어의 cardId카드를 눌렀을 때 일어날 효과
	//먼저 cardId의 위치부터 파악하자
	if(player.id == playerId){
		//내 카드를 눌렸을 때 

		if(Util.findCardById(player.front_fields, cardId) != null){
			//현재 누른 카드가 프론트 필드에 있다. 
		}
		else if(Util.findCardById(player.hand, cardId) != null){ 
			//현재 누른 카드가 패에 있다. (카드 사용)
			//카드의 타입을 보고 해당하는 함수 실행
			var card = Util.findCardById(player.hand, cardId);
	
			switch(card.proto.type){
				case Constant.cardType.product :
					console.log("summon");
					if(this.putProductCard(player, card)){
						this.sendScreen();
					}
					break;
			}
		}
	}
}
		
