var Effect = require('./effect');
var Constant = require('./constant');

exports = module.exports = [
	{
		name : "Omnia 1"
		,company : Constant.company.Samsung
		,atk : 100
		,vit : 2000
		,occ : 20
		,type : Constant.cardType.product
		,effects : null
	}
];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
