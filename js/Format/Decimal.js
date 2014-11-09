
// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var TextFormat = Cryptii.TextFormat;
	var DecimalFormat = (function() {
		this._init.apply(this, arguments);
	});

	DecimalFormat.prototype = Object.create(TextFormat.prototype);
	Cryptii.DecimalFormat = DecimalFormat;


	DecimalFormat.prototype._init = function(options)
	{
		// call parent init
		TextFormat.prototype._init.apply(this, arguments);

		// options
		this.registerOption('separator', new Cryptii.Option('Separator', ' '));
	};


	DecimalFormat.prototype.getName = function()
	{
		return 'Decimal';
	};

	DecimalFormat.prototype._getSeparator = function()
	{
		return this.getOptionValue('separator');
	};

	DecimalFormat.prototype.interpretBlock = function(contentBlock)
	{
		if (!isNaN(contentBlock))
		{
			return parseInt(contentBlock);
		}

		return null;
	};

	DecimalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal;
	};

})(Cryptii, jQuery);
