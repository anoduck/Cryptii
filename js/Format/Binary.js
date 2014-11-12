
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.BinaryFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.BinaryFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var BinaryFormat = Cryptii.BinaryFormat.prototype;


	BinaryFormat.getName = function()
	{
		return 'Binary';
	};

	BinaryFormat.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 2);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	BinaryFormat.convertBlock = function(decimal)
	{
		return decimal.toString(2);
	};

})(Cryptii, jQuery);
