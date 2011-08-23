var Protocard = require('./protocard');
var Effect = require('./effect');
var Player = require('./player');

exports = module.exports = Card;

function Card (protocard) { 
	var atk = 0;
	var vit = 0;
	var occ = 0;
	var own = null; // Owner of Card
	var appearTurn = 0; // Turn of Appearance
	var roh = 0; // Rate of Help
	var cost = 0;

	this.proto = protocard;

/*	for (var setting in settings) {
		this[setting] = settings[setting];
	}*/
}

Card.prototype.getProtocard = function () {
	return this.proto;
}

