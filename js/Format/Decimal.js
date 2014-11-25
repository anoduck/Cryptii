
// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.DecimalFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.DecimalFormat.prototype = Object.create(Cryptii.TextFormat.prototype);

	var TextFormat = Cryptii.TextFormat.prototype;
	var DecimalFormat = Cryptii.DecimalFormat.prototype;


	DecimalFormat.init = function()
	{
		// call parent init
		TextFormat.init.apply(this);

		// separator option
		this.registerOption('separator', new Cryptii.MultipleChoiceOption({
			label: 'Separator',
			value: ' ',
			optional: true,
			choices: {
				' ': 'Space',
				',': 'Comma',
				', ': 'Comma with Space',
				';': 'Semicolon',
				'+': 'Plus'
			}
		}));
	};


	DecimalFormat.getName = function()
	{
		return 'Decimal';
	};

	DecimalFormat._getSeparator = function()
	{
		return this.getOptionValue('separator');
	};

	DecimalFormat.interpretBlock = function(contentBlock)
	{
		if (!isNaN(contentBlock))
		{
			return parseInt(contentBlock);
		}

		return null;
	};

	DecimalFormat.convertBlock = function(decimal)
	{
		return decimal;
	};

})(Cryptii, jQuery);
