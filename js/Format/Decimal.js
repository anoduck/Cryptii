
// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.DecimalFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.DecimalFormat.prototype = Object.create(Cryptii.TextFormat.prototype);

	var TextFormat = Cryptii.TextFormat.prototype;
	var DecimalFormat = Cryptii.DecimalFormat.prototype;


	DecimalFormat.init = function(options)
	{
		// call parent init
		TextFormat.init.apply(this, arguments);

		// options
		this.registerOption('separator', new Cryptii.MultipleChoiceOption('Separator', ' ', {
			' ': 'Space',
			', ': 'Comma and Space',
			';': 'Semicolon'
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
