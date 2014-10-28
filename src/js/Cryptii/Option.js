
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
		this._optionView = null;
		this._format = null;
		this._label = label;
		this._value = value;
	};

	Option.prototype._createOptionView = function()
	{
		return new Cryptii.TextOptionView(this);
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
		if (this._optionView === null)
		{
			this._optionView = this._createOptionView();
		}

		return this._optionView;
	};

	Option.prototype.setFormat = function(format)
	{
		this._format = format;
	};

	//
	// event handling
	//

	Option.prototype.onOptionViewChange = function(optionView, value)
	{
		this._value = value;

		if (this._format !== null)
		{
			this._format.onOptionChange(this, value);
		}
	};

})(Cryptii, jQuery);
