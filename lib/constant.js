exports.company = {
	Samsung : "Samsung"
	,Google : "Google"
	,Apple : "Apple"
	,Microsoft : "Microsoft"
};

exports.cardType = {
	product : "product"
	,skill : "skill"
	,tactic : "tactic"
};
exports.placeType = {
	peace : "peace"
	,fight : "fight"
};

exports.userState = {
	waiting : "waiting"
	,playing : "playing"
};
exports.gameState = {
	turnStart : "turnStart"
	,turnEnd : "turnEnd"
	,putStart : "putStart"
	,putEnd : "putEnd"
	,attackStart : "attackStart"
	,attackEnd : "attackEnd"
	,selectionEnd : "selectionEnd"
	,notTurn : "notTurn"
};
exports.game = {
	maxPlayer : 2
	,maxTurn : 20
	,moneyPerTurn : 50
	,initMoney : 100
	,initOcc : 50
	,initHand : 4
	,maxOcc : 100
	,maxFrontFieldCard : 3
	,maxBackFieldCard : 3
	,maxSkillCard : 1
	,maxTacticCard : 2
	,maxTime : 20
	,maxDeck : 30
	,cardBackSide : "/back.jpg"
	,attackCost : 15
}


