
// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Rot13Format = (function() { this.init.apply(this, arguments); });
	Cryptii.Rot13Format.prototype = Object.create(Cryptii.TextFormat.prototype);

	var TextFormat = Cryptii.TextFormat.prototype;
	var Rot13Format = Cryptii.Rot13Format.prototype;


	Rot13Format.init = function()
	{
		// call parent init
		TextFormat.init.call(this);

		// separator option
		this.registerOption('variant', new Cryptii.MultipleChoiceOption({
			label: 'Variant',
			value: 'rot13',
			optional: false,
			choices: {
				'rot5': 'ROT5 (0-9)',
				'rot13': 'ROT13 (a-z, A-Z)',
				'rot5+rot13': 'ROT5+ROT13 (0-9, a-z, A-Z)',
				'rot47': 'ROT47 (!-~)'
			}
		}));
	};


	Rot13Format.getName = function()
	{
		return 'ROT13';
	};

	Rot13Format.getCategory = function()
	{
		return 'Cipher';
	};

	Rot13Format.interpretBlock = function(contentBlock)
	{
		var decimal = TextFormat.interpretBlock.call(this, contentBlock);

		// rotate
		return this.rotateBlock(decimal);
	};

	Rot13Format.convertBlock = function(decimal)
	{
		// rotate
		decimal = this.rotateBlock(decimal);

		return TextFormat.convertBlock.call(this, decimal);
	};

	Rot13Format.rotateBlock = function(decimal)
	{
		var variant = this.getOptionValue('variant');

		// rot5
		if (variant == 'rot5' || variant == 'rot5+rot13')
		{
			// 0-9
			decimal = this.rotate(decimal, 48, 57);
		}

		// rot13
		if (variant == 'rot13' || variant == 'rot5+rot13')
		{
			// a-z
			decimal = this.rotate(decimal, 97, 122);

			// A-Z
			decimal = this.rotate(decimal, 65, 90);
		}

		// rot5
		if (variant == 'rot47')
		{
			// !-~
			decimal = this.rotate(decimal, 33, 126);
		}

		return decimal;
	};

	Rot13Format.rotate = function(decimal, begin, end)
	{
		if (decimal >= begin && decimal <= end)
		{
			var count = end - begin + 1;

			decimal += count / 2;

			if (decimal > end) {
				decimal -= count
			}
		}

		return decimal;
	};

})(Cryptii, jQuery);
