
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.OctalFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.OctalFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var OctalFormat = Cryptii.OctalFormat.prototype;


	OctalFormat.getName = function()
	{
		return 'Octal';
	};

	OctalFormat.validateContentBlock = function(contentBlock)
	{
		return new Cryptii.Utility().validateAllowedCharacters(
			contentBlock, ['0', '1', '2', '3', '4', '5', '6', '7']);
	};

	OctalFormat.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 8);

		if (!isNaN(decimal)) {
			return decimal;
		}

		return null;
	};

	OctalFormat.convertBlock = function(decimal)
	{
		return decimal.toString(8);
	};

})(Cryptii, jQuery);
