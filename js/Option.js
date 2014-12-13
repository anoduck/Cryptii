
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Option = (function() { this.init.apply(this, arguments); });
	Cryptii.Option.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Option = Cryptii.Option.prototype;
	

	Option.init = function(details)
	{
		// call parent init
		Adam.init.call(this);

		// attributes
		this._optionView = null;

		this._label = details['label'];
		this._optional = (details['optional'] !== false);

		this._defaultValue = details['value'];
		this._value = details['value'];
	};

	Option._createOptionView = function()
	{
		return new Cryptii.TextOptionView(this);
	};


	Option.validateValue = function(value)
	{
		// in the base option, every value will validate
		//  in addition convert possible integer values to strings
		return value + '';
	};

	//
	// delegates
	//

	Option.onOptionViewChange = function(optionView, value)
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

	Option.getValue = function()
	{
		return this._value;
	};

	Option.getEscapedValue = function()
	{
		// escapes every special character except !*()'
		return encodeURIComponent(this.getValue()).replace(/~/g, '%7e');
	};

	Option.isDefaultValue = function()
	{
		return (this._value == this._defaultValue);
	};

	Option.setValue = function(value)
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
	
	Option.getLabel = function()
	{
		return this._label;
	};

	Option.isOptional = function()
	{
		return this._optional;
	};

	Option.setOptional = function(optional)
	{
		this._optional = optional;
	};

	Option.getOptionView = function()
	{
		if (this._optionView === null)
		{
			this._optionView = this._createOptionView();
		}

		return this._optionView;
	};

})(Cryptii, jQuery);
