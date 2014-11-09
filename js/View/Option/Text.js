
// requires Cryptii.OptionView

(function(Cryptii, $) {
	'use strict';

	// define class
	var OptionView = Cryptii.OptionView;
	var TextOptionView = (function() {
		this._init.apply(this, arguments);
	});

	TextOptionView.prototype = Object.create(OptionView.prototype);
	Cryptii.TextOptionView = TextOptionView;


	TextOptionView.prototype._init = function(option)
	{
		// call parent init
		OptionView.prototype._init.apply(this, arguments);

		// attributes
		this._$input = null;
	};


	TextOptionView.prototype._buildField = function()
	{
		// call parent
		var $element = OptionView.prototype._buildField.apply(this)
		
		// input element
		this._$input =
			$('<input>')
				.keyup(this._trackChanges.bind(this));

		this._applyValue(this._lastKnownValue);

		$element.append(this._$input);

		return $element;
	};

	TextOptionView.prototype.getValue = function()
	{
		return this._$input.val();
	};

	TextOptionView.prototype._applyValue = function(value)
	{
		this._$input.val(value);
	};

})(Cryptii, jQuery);
