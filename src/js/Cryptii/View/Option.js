
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var OptionView = (function() {
		this._init.apply(this, arguments);
	});

	OptionView.prototype = Object.create(View.prototype);
	Cryptii.OptionView = OptionView;


	OptionView.prototype._init = function(option)
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._option = option;
	};

	OptionView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// populate element
		$element
			.addClass('option')
			.append(
				this._buildLabel(),
				this._buildField()
			);

		return $element;
	};

	OptionView.prototype._buildLabel = function()
	{
		return $('<label></label>')
			.text(this._option.getLabel());
	};

	OptionView.prototype._buildField = function()
	{
		return $('<div></div>')
			.addClass('field');
	};

})(Cryptii, jQuery);
