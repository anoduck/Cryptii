
// requires Cryptii.OptionView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.MultipleChoiceOptionView = (function() { this.init.apply(this, arguments); });
	Cryptii.MultipleChoiceOptionView.prototype = Object.create(Cryptii.OptionView.prototype);

	var OptionView = Cryptii.OptionView.prototype;
	var MultipleChoiceOptionView = Cryptii.MultipleChoiceOptionView.prototype;


	MultipleChoiceOptionView.init = function(option)
	{
		// call parent init
		OptionView.init.call(this, option);

		// attributes
		this._$value = null;
	};


	MultipleChoiceOptionView._buildField = function()
	{
		// call parent
		var $element = OptionView._buildField.apply(this);
		
		// value element
		this._$value =
			$('<div></div>')
				.addClass('value');

		this._applyValue(this._lastKnownValue);

		$element.append(this._$value);

		return $element;
	};

	MultipleChoiceOptionView._buildBar = function()
	{
		return OptionView._buildBar.apply(this)
			.append(
				$('<a></a>')
					.addClass('bar-button icon-left')
					.attr('href', 'javascript:void(0);')
					.click(this.onPreviousButtonClick.bind(this))
					.text('Previous'),
				$('<a></a>')
					.addClass('bar-button icon-right')
					.attr('href', 'javascript:void(0);')
					.click(this.onNextButtonClick.bind(this))
					.text('Next')
			);
	};

	MultipleChoiceOptionView.getValue = function()
	{
		// this disables value change tracking
		//  value changes will be propagated by click event
		return this._lastKnownValue;
	};

	MultipleChoiceOptionView._applyValue = function(value)
	{
		var index = this._option.getIndexForChoice(value);
		var label = this._option.getLabelAtIndex(index);
		var description = this._option.getDescriptionAtIndex(index);

		this._$value.text(label);

		if (description !== null) {
			this._$value.append(
				' ',
				$('<span></span>')
					.addClass('description')
					.text('(' + description + ')')
			);
		}
	};

	MultipleChoiceOptionView.onNextButtonClick = function(evt)
	{
		var index = this._option.getSelectedIndex();
		var count = this._option.getChoiceCount();
		if (++ index > count - 1) {
			index = 0;
		}

		var value = this._option.getChoiceAtIndex(index);
		this._applyValue(value);
		this.onValueChange(value);
	};

	MultipleChoiceOptionView.onPreviousButtonClick = function(evt)
	{
		var index = this._option.getSelectedIndex();
		var count = this._option.getChoiceCount();
		if (-- index < 0) {
			index = count - 1;
		}

		var value = this._option.getChoiceAtIndex(index);
		this._applyValue(value);
		this.onValueChange(value);
	};

})(Cryptii, jQuery);
