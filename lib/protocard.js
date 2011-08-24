var EffectUtil = require('./effectutil');
var Constant = require('./constant');
var Effect = require('./effect');

exports = module.exports = [
	{
		name : "Omnia 1"
		,company : Constant.company.Samsung
		,atk : 300
		,vit : 1000
		,occ : 10
		,cost : 10
		,type : Constant.cardType.product
		,image : "/omnia_1.png"
		,text : "옴니아1"
		,effects : [
			new Effect({
				continueTurn : 1
				,condition : function (card, game, player) {
					return (
								((EffectUtil.whenCardExistbyNameinFrontField("Omnia 1"))(card, game, player))
								&& (!(EffectUtil.hasExpired(this.continueTurn))(card, game, player))
								);
				}
				,affect : function(card, game, player){
					(EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 1", 10))(card, game, player);
				}
			})
		]
	},
	{
		name : "Omnia 2"
		,company : Constant.company.Samsung
		,atk : 500
		,vit : 1000
		,occ : 10
		,cost : 25
		,image : "/omnia_2.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "Galaxy A"
		,company : Constant.company.Samsung
		,atk : 600
		,vit : 2000
		,occ : 15
		,cost : 40
		,image : "/galaxy_a.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "Galaxy S"
		,company : Constant.company.Samsung
		,atk : 900
		,vit : 2000
		,occ : 15
		,cost : 50
		,image : "/galaxy_s.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "Galaxy Tab"
		,company : Constant.company.Samsung
		,atk : 200
		,vit : 5000
		,occ : 10
		,cost : 50
		,image : "/galaxy_tab.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "이건희"
		,company : Constant.company.Samsung
		,atk : 100
		,vit : 7000
		,occ : 5
		,cost : 80
		,image : "/lee.png"
		,type : Constant.cardType.product
		,effects : null
	},
	{
		name : "OS Bada"
		,company : Constant.company.Samsung
		,atk : 1500
		,vit : 800
		,occ : 5
		,cost : 30
		,image : "/bada.png"
		,type : Constant.cardType.product
		,effects : null
	}



];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
