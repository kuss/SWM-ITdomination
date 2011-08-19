exports = module.exports = Effect;

function Effect(settings) {
	for(var setting in settings) {
		this[setting] = settings[setting];
	}
	
}
