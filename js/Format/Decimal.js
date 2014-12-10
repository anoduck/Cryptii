
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
		TextFormat.init.call(this);

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
	
	//
	// information
	//

	DecimalFormat.getName = function()
	{
		return 'Decimal';
	};

	DecimalFormat.getSlug = function()
	{
		return 'decimal';
	};

	DecimalFormat.getCategory = function()
	{
		return 'Numeric';
	};
	
	//
	// convert and interpret
	//

	DecimalFormat._getSeparator = function()
	{
		return this.getOptionValue('separator');
	};

	DecimalFormat.convertBlock = function(decimal)
	{
		return decimal;
	};

	DecimalFormat.validateContentBlock = function(contentBlock)
	{
		return new Cryptii.Utility().validateAllowedCharacters(
			contentBlock, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
	};

	DecimalFormat.interpretBlock = function(contentBlock)
	{
		if (!isNaN(contentBlock)) {
			return parseInt(contentBlock);
		}

		return null;
	};

})(Cryptii, jQuery);
