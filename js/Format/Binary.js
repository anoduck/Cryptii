
// requires Cryptii.DecimalFormat

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.BinaryFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.BinaryFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var BinaryFormat = Cryptii.BinaryFormat.prototype;

	//
	// information
	//

	BinaryFormat.getName = function()
	{
		return 'Binary';
	};

	BinaryFormat.getSlug = function()
	{
		return 'binary';
	};

	//
	// convert and interpret
	//

	BinaryFormat.convertBlock = function(decimal)
	{
		return decimal.toString(2);
	};

	BinaryFormat.validateContentBlock = function(contentBlock)
	{
		return new Cryptii.Utility().validateAllowedCharacters(
			contentBlock, ['0', '1']);
	};

	BinaryFormat.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 2);

		if (!isNaN(decimal)) {
			return decimal;
		}

		return null;
	};

})(Cryptii);
