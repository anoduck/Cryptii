
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var BinaryFormat = (function() {
		this._init.apply(this, arguments);
	});

	BinaryFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.BinaryFormat = BinaryFormat;


	BinaryFormat.prototype.getName = function()
	{
		return 'Binary';
	};

	BinaryFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 2);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	BinaryFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(2);
	};

})(Cryptii, jQuery);
