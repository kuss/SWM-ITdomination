var Effect = require('./effect');
var Constant = require('./constant');

exports = module.exports = ProtoCard;

var ProtoCard = [
	{
		name : "asdf"
		,company : Constant.company.Samsung
		,atk : 100
		,vit : 10000
		,occ : 30
		,type : Constant.cardType.product
		,effects : null
	}
];

/*function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};*/
