var Protocard = require('./protocard');
var Effect = require('./effect');
var Player = require('./player');

exports = module.exports = Card;

function Card (protocard) { 
	this.atk = protocard.atk;
	this.vit = protocard.vit;
	this.occ = protocard.occ;
	this.own = null; // Owner of Card
	this.appearTurn = 0; // Turn of Appearance
	this.helpatk = 0; // Help Attack
	this.cost = protocard.cost;

	this.proto = protocard;

/*	for (var setting in settings) {
		this[setting] = settings[setting];
	}*/
}

