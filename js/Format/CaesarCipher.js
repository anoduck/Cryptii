
// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.CaesarCipherFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.CaesarCipherFormat.prototype = Object.create(Cryptii.TextFormat.prototype);

	var TextFormat = Cryptii.TextFormat.prototype;
	var CaesarCipherFormat = Cryptii.CaesarCipherFormat.prototype;


	CaesarCipherFormat.init = function()
	{
		// call parent init
		TextFormat.init.call(this);

		// shift option
		var choices = {};

		var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (var i = 1; i < 26; i ++)
		{
			var label = '';

			// show the actual shift
			label = '+' + i;

			// represent the shift
			label += ' (A=' + alphabet[i] + ')';

			choices[i] = label;
		}

		this.registerOption('shift', new Cryptii.MultipleChoiceOption({
			label: 'Shift',
			value: '3',
			optional: false,
			choices: choices
		}));
	};

	//
	// information
	//

	CaesarCipherFormat.getName = function()
	{
		return 'Caesar Cipher';
	};

	CaesarCipherFormat.getSlug = function()
	{
		return 'caesar-cipher';
	};

	CaesarCipherFormat.getCategory = function()
	{
		return 'Cipher';
	};

	//
	// convert and interpret
	//

	CaesarCipherFormat.convertBlock = function(decimal)
	{
		// rotate
		decimal = this.rotateBlock(decimal, true);

		return TextFormat.convertBlock.call(this, decimal);
	};

	CaesarCipherFormat.interpretBlock = function(contentBlock)
	{
		var decimal = TextFormat.interpretBlock.call(this, contentBlock);

		// rotate
		return this.rotateBlock(decimal, false);
	};

	CaesarCipherFormat.rotateBlock = function(decimal, forward)
	{
		var shift = parseInt(this.getOptionValue('shift'));

		// reverse shift
		shift *= (forward ? 1 : -1);

		// rotate lowercase
		decimal = this.rotate(decimal, 97, 122, shift);

		// rotate uppercase
		decimal = this.rotate(decimal, 65, 90, shift);

		return decimal;
	};

	CaesarCipherFormat.rotate = function(decimal, begin, end, shift)
	{
		if (decimal >= begin && decimal <= end)
		{
			var count = end - begin + 1;

			decimal += shift;

			if (decimal > end) {
				decimal -= count;
			} else if (decimal < begin) {
				decimal += count;
			}
		}

		return decimal;
	};

})(Cryptii, jQuery);
