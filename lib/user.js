exports = module.exports = User;

function User (settings) {
	this.id = 0;
	this.name = " ";
	this.win = 0;
	this.draw = 0;
	this.lose = 0;
	this.deck = [];

	for (var setting in settings) {
		this[setting] = settings[setting];
	}
};

