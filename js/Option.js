
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var Option = (function() {
		this._init.apply(this, arguments);
	});

	Option.prototype = Object.create(Adam.prototype);
	Cryptii.Option = Option;
	

	Option.prototype._init = function(label, defaultValue)
	{
		// call parent init
		Adam.prototype._init.apply(this, arguments);

		// attributes
		this._optionView = null;

		this._label = label;

		this._defaultValue = defaultValue;
		this._value = defaultValue;
	};

	Option.prototype._createOptionView = function()
	{
		return new Cryptii.TextOptionView(this);
	};


	Option.prototype.validateValue = function(value)
	{
		// in the base option, every value will validate
		//  in addition convert possible integer values to strings
		return value + '';
	};

	//
	// delegates
	//

	Option.prototype.onOptionViewChange = function(optionView, value)
	{
		// check if value validates
		if (this.setValue(value))
		{
			this.delegate('onOptionChange', value);
		}
	};

	//
	// accessors
	//

	Option.prototype.getValue = function()
	{
		return this._value;
	};

	Option.prototype.getEscapedValue = function()
	{
		// escapes every special character except !*()'
		return encodeURIComponent(this.getValue()).replace(/~/g, '%7e');
	};

	Option.prototype.isDefaultValue = function()
	{
		return (this._value == this._defaultValue);
	};

	Option.prototype.setValue = function(value)
	{
		if (value !== null)
		{
			// validate value
			var validatedValue = this.validateValue(value);
			if (validatedValue !== null)
			{
				this._value = validatedValue;
				return true;
			}
		}

		return false;
	};
	
	Option.prototype.getLabel = function()
	{
		return this._label;
	};

	Option.prototype.getOptionView = function()
	{
		if (this._optionView === null)
		{
			this._optionView = this._createOptionView();
		}

		return this._optionView;
	};

})(Cryptii, jQuery);
