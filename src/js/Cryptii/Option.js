
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Option = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Option = Option;
	

	Option.prototype._init = function(label, value)
	{
		// attributes
		this._label = label;
		this._value = value;

		this._optionView = null;
	};


	Option.prototype.getLabel = function()
	{
		return this._label;
	};

	Option.prototype.isValueValid = function(value)
	{
		// the base class validates every value
		return true;
	};

	Option.prototype.getValue = function()
	{
		return this._value;
	};

	Option.prototype.setValue = function(value)
	{
		if (this.isValueValid(value))
		{
			this._value = value;
			return true;
		}

		return false;
	};

	Option.prototype.getOptionView = function()
	{
		return this._optionView;
	};

})(Cryptii, jQuery);
