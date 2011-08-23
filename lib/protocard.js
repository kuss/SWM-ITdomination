var Effect = require('./effect');
var Constant = require('./constant');

exports = module.exports = [
	{
		name : "Omnia 1"
		,company : Constant.company.Samsung
		,atk : 200
		,vit : 1000
		,occ : 10
		,type : Constant.cardType.product
	,effects : null
	},
	{
		name : "Omnia 2"
		,company : Constant.company.Samsung
		,atk : 400
		,vit : 1000
		,occ : 10
		,type : Constant.cardType.product
		,effects : null
	}
];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
