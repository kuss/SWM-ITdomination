var EffectUtil = require('./effectutil');
var Constant = require('./constant');
var Effect = require('./effect');

exports = module.exports = [
	{
		name : "Omnia 1"
		,company : Constant.company.Samsung
		,atk : 700 /*TODO for test 300*/
		,vit : 1000
		,occ : 10
		,cost : 10
		,type : Constant.cardType.product
		,image : "/front.jpg"
		,effects : [
			new Effect({
				condition : function (state, game, player) {
					EffectUtil.whenCardExistbyNameinField("이건희")
				}
				,affect : function(state, game, player){
					EffectUtil.increaseCardAttackbyValueinFrontField("Omnia 1", 10);
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
		,type : Constant.cardType.product
		,effects : null
	}



];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
