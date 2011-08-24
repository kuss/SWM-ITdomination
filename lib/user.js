var Constant = require('./constant');
var Place = require('./place');

exports = module.exports = User;

function User (settings) {
	this.id = 0;
	this.name = " ";
	this.win = 0;
	this.draw = 0;
	this.lose = 0;
	this.deck = [];

	this.userState = Constant.userState.wait;
	this.place = Place[0];

	for (var setting in settings) {
		this[setting] = settings[setting];
	}
};

