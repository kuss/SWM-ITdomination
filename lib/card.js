var Protocard = require('./protocard');
var Effect = require('./effect');
var Player = require('./player');

exports = module.exports = Card;

function Card (settings) {
	var atk = 0;
	var vit = 0;
	var occ = 0;
	var own = null; // Owner of Card
	var appearTurn = 0; // Turn of Appearance

	for (var setting in settings) {
		this[setting] = settings[setting];
	}

}

Card.prototype.__proto__ = ProtoCard.prototype;


