
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var HexadecimalFormat = (function() {
		this._init.apply(this, arguments);
	});

	HexadecimalFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.HexadecimalFormat = HexadecimalFormat;


	HexadecimalFormat.prototype.getTitle = function()
	{
		return 'Hexadecimal';
	};

	HexadecimalFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 16);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	HexadecimalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(16);
	};

})(Cryptii, jQuery);
