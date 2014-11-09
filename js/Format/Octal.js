
// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var OctalFormat = (function() {
		this._init.apply(this, arguments);
	});

	OctalFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.OctalFormat = OctalFormat;


	OctalFormat.prototype.getName = function()
	{
		return 'Octal';
	};

	OctalFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 8);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	OctalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(8);
	};

})(Cryptii, jQuery);
