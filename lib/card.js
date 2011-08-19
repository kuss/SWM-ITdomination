var Protocard = require('./protocard');
var Effect = require('./effect');

exports = module.exports = Card;

function Card (settings) {
	for (var setting in settings) {
		this[setting] = settings[setting];
	}

}

Card.prototype.__proto__ = ProtoCard.prototype;


