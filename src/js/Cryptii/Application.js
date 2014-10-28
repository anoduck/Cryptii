
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Application = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Application = Application;


	Application.prototype._init = function()
	{
		this._deckView = new Cryptii.DeckView();
		this._conversation = new Cryptii.Conversation(this._deckView);

		// default blocks
		this._conversation.setBlocks([
			84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114,
			111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112,
			115, 32, 111, 118, 101, 114, 32, 49, 51, 32, 108, 97,
			122, 121, 32, 100, 111, 103, 115, 46
		]);

		// add example cards
		this._conversation.addFormat(new Cryptii.TextFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.BinaryFormat());
		this._conversation.addFormat(new Cryptii.HexadecimalFormat());
		this._conversation.addFormat(new Cryptii.OctalFormat());
	};

})(Cryptii, jQuery);
