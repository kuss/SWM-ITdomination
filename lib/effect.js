exports = module.exports = Effect;

function Effect(settings) {
	this.condition = function() {return true;};
	this.affect = function() {
			if (this.condition()) {
				return true;	
			}
			return false;
		};
	for(var setting in settings) {
		this[setting] = settings[setting];
	}
	
}
