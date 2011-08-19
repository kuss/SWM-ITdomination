var User = require('./user');

exports = module.exports = Player;

function Player (settings) {
	for (var setting in settings) {
		this[setting] = settings[setting];
	}
}

Player.prototype.__proto__ = User.prototype;

