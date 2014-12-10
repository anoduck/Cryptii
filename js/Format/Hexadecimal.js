
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.HexadecimalFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.HexadecimalFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var HexadecimalFormat = Cryptii.HexadecimalFormat.prototype;

	//
	// information
	//

	HexadecimalFormat.getName = function()
	{
		return 'Hexadecimal';
	};

	HexadecimalFormat.getSlug = function()
	{
		return 'hexadecimal';
	};

	//
	// convert and interpret
	//

	HexadecimalFormat.convertBlock = function(decimal)
	{
		return decimal.toString(16);
	};

	HexadecimalFormat.validateContentBlock = function(contentBlock)
	{
		return new Cryptii.Utility().validateAllowedCharacters(
			contentBlock, [
				'0', '1', '2', '3', '4', '5', '6', '7',
				'8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
			]);
	};

	HexadecimalFormat.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 16);

		if (!isNaN(decimal)) {
			return decimal;
		}

		return null;
	};

})(Cryptii, jQuery);
