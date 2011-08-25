var EffectUtil = require('./effectutil');
var Constant = require('./constant');
var Effect = require('./effect');

/*

	각 카드에 대한 프로퍼티는 10개씩 있습니다.
*/

exports = module.exports = [
	{
		name : "Omnia 1"
		,company : Constant.company.Samsung
		,atk : 300
		,vit : 1000
		,occ : 2
		,cost : 10
		,type : Constant.cardType.product
		,image : "/omnia_1.png"
		,text : "삼성의 휴대폰 Omnia 1입니다. 이 카드가 필드위에 놓여졌을 때 필드위에 있는 Omnia로 시작하는 시제품들의 공격력을 200 증가시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
								((EffectUtil.whenCardExistbyNameinFrontField("Omnia 1"))(card, game, player))
								&& (!(EffectUtil.hasExpired(this.continueTurn))(card, game, player))
								);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 1", 200))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 2", 200))(card, game, player);	
				}
			})
		]
	},
	{
		name : "Omnia 2"
		,company : Constant.company.Samsung
		,atk : 500
		,vit : 1000
		,occ : 3
		,cost : 25
		,image : "/omnia_2.png"
		,type : Constant.cardType.product
		,text : "삼성의 휴대폰 Omnia 2입니다. 이 카드가 필드위에 놓여졌을 때 필드위에 있는 Omnia로 시작하는 시제품들의 공격력을 250 증가시킵니다."
		,effects : [
			new Effect ({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
							((EffectUtil.whenCardExistbyNameinFrontField("Omnia 2"))(card, game, player))
							&&(!(EffectUtil.hasExpired(this.continueTurn))(card,game,player))
							);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 1", 250))(card,game,player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 2", 250))(card,game,player);
				}
			})
		]
	},
	{
		name : "Galaxy A"
		,company : Constant.company.Samsung
		,atk : 600
		,vit : 1200
		,occ : 4
		,cost : 40
		,image : "/galaxy_a.png"
		,type : Constant.cardType.product
		,text : "삼성의 휴대폰 Galaxy A입니다."
		,effects : []
	},
	{
		name : "Galaxy S"
		,company : Constant.company.Samsung
		,atk : 900
		,vit : 1300
		,occ : 5
		,cost : 50
		,image : "/galaxy_s.png"
		,text : "삼성의 휴대폰 Galaxy S입니다."
		,type : Constant.cardType.product
		,effects : []
	},
	{
		name : "Galaxy S2"
		,company : Constant.company.Samsung
		,atk : 1200
		,vit : 1500
		,occ : 6
		,cost : 60
		,image : "/galaxy_s2.png"
		,text : "삼성의 휴대폰 Galaxy S2입니다."
		,effects : []
		,type : Constant.cardType.product
	},
	{
		name : "Galaxy Tab"
		,company : Constant.company.Samsung
		,atk : 200
		,vit : 2000
		,occ : 2
		,cost : 50
		,image : "/galaxy_tab.png"
		,type : Constant.cardType.product
		,text : "삼성의 Galaxy Tab 입니다. 만약 시장을 점유하고 있다면 턴당 그 제품의 체력을 100 회복시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function(card,game,player){
					return (EffectUtil.whenPlayerHaveMarket())(card,game,player);
				}
				,affect : function(card,game,player){
					(EffectUtil.increaseVitbyValue(100))(card,game,player);
				}
			})
		]
	},
	{
		name : "Galaxy Tab 10.1"
		,company : Constant.company.Samsung
		,type : Constant.cardType.product
		,atk : 300 
		,vit : 2100
		,occ : 3
		,cost : 70
		,image : "/galaxy_tab_101.png"
		,text : "삼성의 Galaxy Tab 10.1입니다. 만약 시장을 점유하고 있다면 턴당 그 제품의 체력을 200 회복시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function(card,game,player){
					return (EffectUtil.whenPlayerHaveMarket())(card,game,player);
				}
				,affect : function(card,game,player){
					(EffectUtil.increaseVitbyValue(200))(card,game,player);
				}
			})
		]
	},	
	{
		name : "이건희"
		,company : Constant.company.Samsung
		,atk : 100
		,vit : 2000
		,occ : 3
		,cost : 80
		,image : "/lee.png"
		,type : Constant.cardType.product
		,text : "삼성 회장 이건희입니다. 모든 삼성 시제품들의 공격력을 500 증가시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
								((EffectUtil.whenCardExistbyNameinFrontField("이건희"))(card, game, player))
					);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseCardAttackbyValueinFrontField(null, 500))(card, game, player);
				}
			})
		]
	},
	{
		name : "이건희 LV100"
		,company : Constant.company.Samsung
		,atk : 200
		,vit : 2500
		,occ : 5
		,cost : 100
		,image : "/lee_special.png"
		,type : Constant.cardType.product
		,text : "모든 삼성 시제품들의 공격력을 700 증가시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
								((EffectUtil.whenCardExistbyNameinFrontField("이건희 LV100"))(card, game, player))
					);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseCardAttackbyValueinFrontField(null, 700))(card, game, player);
				}
			})
		]
	},
	{
		name : "연아의 햅틱"
		,company : Constant.company.Samsung
		,atk : 500
		,vit : 1500
		,occ : 4
		,cost : 40
		,image : "/haptic.png"
		,type : Constant.cardType.product
		,text : "김연아 선수가 홍보하는 연아의 햅틱 입니다. 필드위에 김연아가 앞면으로 존재하면 공격력을 1000 올립니다."
		,effects : [
			new Effect({
				continueTurn : 3
				,condition : function (card,game,player) {
					return (
							((EffectUtil.whenCardExistbyNameinFrontField("김연아"))(card,game,player))&&(!(EffectUtil.hasExpired(this.continueTurn))(card,game,player))
					);
				}
				,affect : function(card,game,player){
					(EffectUtil.increaseCardAttackbyValueinFrontField("연아의 햅틱",1000))(card,game,player);
				}
			})
		]
	},
	{
		name : "OS Bada"
		,company : Constant.company.Samsung
		,atk : 2000
		,vit : 800
		,occ : 5
		,cost : 30
		,image : "/bada.png"
		,type : Constant.cardType.product
		,text : "삼성이 개발한 OS Bada입니다."
		,effects : []
	},
	{
		name : "김연아"
		,company : Constant.company.Samsung
		,atk : 500
		,vit : 1500
		,occ : 5
		,cost : 40
		,image : "/kim.png"
		,type : Constant.cardType.product
		,text : "김연아 선수입니다."
		,effects : []
	},
	{
		name : "이재용"
		,company : Constant.company.Samsung
		,atk : 200
		,vit : 2000
		,occ : 6
		,cost : 50
		,image : "/lee2.png"
		,type : Constant.cardType.product
		,text : "삼성전자 사장 이재용입니다. 필드위에 존재하면 턴당 얻는 자금을 30 증가시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
								((EffectUtil.whenCardExistbyNameinFrontField("이재용"))(card, game, player))
								|| ((EffectUtil.whenCardExistbyNameinMarket("이재용"))(card, game, player) && (EffectUtil.whenPlayerHaveMarket())(card, game, player) )
					);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseMoneyPerTurnbyValue(30))(card, game, player);
				}
			})
		]
	},
	{
		name : "3D TV"
		,company : Constant.company.Samsung
		,atk : 2000
		,vit : 500
		,occ : 3
		,cost : 30
		,image : "/3dtv.png"
		,type : Constant.cardType.product
		,text : "삼성의 3D TV입니다."
		,effects : []
	},
	{
		name : "D-RAM"
		,company : Constant.company.Samsung
		,type : Constant.cardType.product
		,atk : 500
		,vit : 500
		,occ : 4
		,cost : 50
		,image : "/dram.png"
		,text : "삼성의 D-RAM입니다. 필드위에 존재하는 적 시제품의 공격력을 300 감소시킵니다."
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						((EffectUtil.whenCardExistbyNameinFrontField("D-RAM"))(card, game, player))
					);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increseOtherCardAttackbyValueinFrontField(null, -300))(card, game, player);
				}
			})
		]
	},
/* 이하 삼성 기술카드 */	
	{
		name : "삼엽충 생산"
		,company : Constant.company.Samsung
		,image : "/samsung_fan.png"
		,type : Constant.cardType.skill
		,text : "자신이 시장을 점유하고 있을 때 자신의 필드위에 있는 Omnia 또는 Galaxy가 붙은 제품당 2의 점유력을 추가로 얻습니다."
		,cost : 40
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Omnia 1"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Omnia 2"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Galaxy A"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Galaxy S"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Galaxy S2"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Galaxy Tab"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(player.gameState === Constant.gameState.turnStart) &&
						((EffectUtil.whenPlayerHaveMarket())(card, game, player))
						&& ((EffectUtil.whenCardExistbyNameinFrontField("Galaxy Tab 10.1"))(card, game, player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
			,
		]
	},
	{
		name : "비자금"
		,company : Constant.company.Samsung
		,type : Constant.cardType.skill
		,text : "필드위에 이건희나 이재용이 있을 시 턴당 50의 자금을 추가로 얻습니다."
		,image : "fund.png"
		,cost : 35
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
							(player.gameState === Constant.gameState.turnStart) &&
							(((EffectUtil.whenCardExistbyNameinFrontField("이건희"))(card, game, player))
							|| ((EffectUtil.whenCardExistbyNameinFrontField("이재용"))(card, game, player)))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseOccbyValue(2)(card, game, player));
				}
			})
		]	
	},
	{
		name : "AMOLED"
		,company : Constant.company.Samsung
		,type : Constant.cardType.skill
		,text : "필드위에 있는 Galaxy가 붙은 제품의 공격력을 300 증가시킵니다."
		,image : "/amoled.png"
		,cost : 40
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
							(player.gameState === Constant.gameState.turnStart) &&
							(((EffectUtil.whenCardExistbyNameinFrontField("이건희"))(card, game, player))
							|| ((EffectUtil.whenCardExistbyNameinFrontField("이재용"))(card, game, player)))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy A", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy S", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy S2", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy Tab", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy Tab 10.1", 300))(card, game, player);
				}
			})

		]
	},
	{
		name : "Wheel-Chair"
		,company : Constant.company.Samsung
		,type : Constant.cardType.skill
		,text : "필드위에 있는 이건희의 체력을 턴당 500 회복합니다."
		,image : "/wheelchair.png"
		,cost : 20
		,effects : [
			new Effect({
				continueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
							(player.gameState === Constant.gameState.turnStart) &&
							((EffectUtil.whenPlayerHaveMarket())(card, game, player)) &&
							((EffectUtil.whenCardExistbyNameinMarket("이건희"))(card,game,player))
						);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy A", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy S", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy S2", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy Tab", 300))(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField("Galaxy Tab 10.1", 300))(card, game, player);
				}
			})
		]
	},
	/* 이하 삼성 전략카드 */
	{
		name : "경영 승계"
		,company : Constant.company.Samsung
		,type : Constant.cardType.tactic
		,text : "덱에 있는 이건희를 손패로 가져옵니다. 만약 이건희가 없다면 이재용을 가져옵니다."
		,cost : 25 
		,image : "/takeover.png"
		,effects : [
			new Effect({
				continueTrun : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(!EffectUtil.whenCardExistbyNameinDeck("이건희"))(card, game, player)
					);
				}
				,affect : function (card, game, player) {
					(EffectUtil.getCardfromDeck("이재용"))(card, game, player);
				}
			})
			,new Effect({
				continueTrun : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						(EffectUtil.whenCardExistbyNameinDeck("이건희"))(card, game, player)
					);
				}
				,affect : function (card, game, player) {
					(EffectUtil.getCardfromDeck("이건희"))(card, game, player);
				}
			})
		]
	},
	{
		name : "언론 플레이"
		,company : Constant.company.Samsung
		,type : Constant.cardType.tactic
		,text : "해당 턴에 모든 Omnia 제품들의 공격력을 두배로 만듭니다."
		,cost : 30
		,image : "/propaganda.png"
		,effects : [
			new Effect({
				contintueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						true
					);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseCardAttackbyRateinFrontField)("Omnia 1", 1)(card, game, player);
					(EffectUtil.increaseCardAttackbyRateinFrontField)("Omnia 2", 1)(card, game, player);
				}
			})
		]
	},
	{
		name : "디자인 카피"
		,company : Constant.company.Samsung
		,type : Constant.cardType.tactic
		,text : "해당 턴에 모든 Omnia나 Galaxy 제품들의 공격력을 500 증가시킵니다."
		,cost : 30
		,image : "/copy.png"
		,effects : [
			new Effect({
				contintueTurn : Constant.game.maxTurn
				,condition : function (card, game, player) {
					return (
						true
					);
				}
				,affect : function (card, game, player) {
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Omnia 1", 500)(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Omnia 2", 500)(card, game, player);

					(EffectUtil.increaseCardAttackbyValueinFrontField)("Galaxy A", 500)(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Galaxy S", 500)(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Galaxy S2", 500)(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Galaxy Tab", 500)(card, game, player);
					(EffectUtil.increaseCardAttackbyValueinFrontField)("Galaxy Tab 10.1", 500)(card, game, player);
				}
			})
		]
	},
	/* 이상 삼성 카드 끝 */


	{
		name : "Windows 95"
		,company : Constant.company.microsoft
		,atk : 1500
		,vit : 1400
		,occ : 5
		,cost : 25
		,image : "/win95.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "Windows 98"
		,company : Constant.company.microsoft
		,atk : 2000
		,vit : 2000
		,occ : 5
		,cost : 40
		,image : "/win98.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "Android"
		,company : Constant.company.google
		,atk : 600
		,vit : 3000
		,occ : 20
		,cost : 40
		,image : "/android.png"
		,type : Constant.cardType.product
		,effects : null
	}
];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
