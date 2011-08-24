var Constant = require('./constant');

exports = module.exports = Effect;

function Effect(settings) {
	var continueTurn = -1;
	this.condition = function(state) {return true;};
	this.affect = function(state) {
			if (this.condition(state)) {
				return true;	
			}
			return false;
		};
	for(var setting in settings) {
		this[setting] = settings[setting];
	}	
}
