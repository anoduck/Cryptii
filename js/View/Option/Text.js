
// requires Cryptii.OptionView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.TextOptionView = (function() { this.init.apply(this, arguments); });
	Cryptii.TextOptionView.prototype = Object.create(Cryptii.OptionView.prototype);

	var OptionView = Cryptii.OptionView.prototype;
	var TextOptionView = Cryptii.TextOptionView.prototype;


	TextOptionView.init = function(option)
	{
		// call parent init
		OptionView.init.apply(this, arguments);

		// attributes
		this._$input = null;
	};


	TextOptionView._build = function()
	{
		return OptionView._build.apply(this);
	};

	TextOptionView._buildField = function()
	{
		// call parent
		var $element = OptionView._buildField.apply(this);
		
		// input element
		this._$input =
			$('<input>')
				.addClass('text')
				.keyup(this._trackChanges.bind(this));

		this._applyValue(this._lastKnownValue);

		$element.append(this._$input);

		return $element;
	};

	TextOptionView._buildBar = function()
	{
		return null;
	};

	TextOptionView.getValue = function()
	{
		return this._$input.val();
	};

	TextOptionView._applyValue = function(value)
	{
		this._$input.val(value);
	};

})(Cryptii, jQuery);
