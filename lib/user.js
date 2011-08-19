exports = module.exports = User;

function User (settings) {
	for (var setting in settings) {
		this[setting] = settings[setting];
	}
};

