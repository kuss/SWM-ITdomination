module.exports = function (settings) {
	for(var setting in settings) {
		this[setting] = settings[setting];
	}
	
}
