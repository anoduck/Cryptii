
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.OptionView = (function() { this.init.apply(this, arguments); });
	Cryptii.OptionView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var OptionView = Cryptii.OptionView.prototype;


	OptionView.init = function(option)
	{
		// call parent init
		View.init.apply(this, arguments);

		// attributes
		this._option = option;
		this._lastKnownValue = option.getValue();
	};


	OptionView._build = function()
	{
		// call parent
		var $element = View._build.apply(this);

		// populate element
		$element
			.addClass('option')
			.append(
				this._buildLabel(),
				this._buildField()
			);

		return $element;
	};

	OptionView._buildLabel = function()
	{
		return $('<label></label>')
			.text(this._option.getLabel());
	};

	OptionView._buildField = function()
	{
		return $('<div></div>')
			.addClass('field');
	};

	OptionView.getValue = function()
	{
		// override this method
		return null;
	};

	OptionView._applyValue = function(value)
	{
		// override this method
	};

	OptionView.setValue = function(value)
	{
		this._lastKnownValue = value;
		this._applyValue(value);
	};

	OptionView.tick = function()
	{
		this._trackChanges();
	};

	OptionView._trackChanges = function()
	{
		var value = this.getValue();

		// check if the value has been changed
		if (value != this._lastKnownValue) {
			this.onValueChange(value);
		}
	};

	OptionView.onValueChange = function(value)
	{
		this._lastKnownValue = value;
		this._option.onOptionViewChange(this, value);
	};

})(Cryptii, jQuery);
