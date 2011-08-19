var Effect = require('./effect');

exports = module.exports = ProtoCard;

function ProtoCard (settings) {
	for(var setting in settings) {
		this[settings] = settings[setting];
	}
};
