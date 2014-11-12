
// requires Cryptii.OptionView

(function(Cryptii, $) {
	'use strict';

	// define class
	var OptionView = Cryptii.OptionView;
	var MultipleChoiceOptionView = (function() {
		this._init.apply(this, arguments);
	});

	MultipleChoiceOptionView.prototype = Object.create(OptionView.prototype);
	Cryptii.MultipleChoiceOptionView = MultipleChoiceOptionView;


	MultipleChoiceOptionView.prototype._init = function(option)
	{
		// call parent init
		OptionView.prototype._init.apply(this, arguments);

		// attributes
		this._$choice = null;
	};


	MultipleChoiceOptionView.prototype._build = function()
	{
		return OptionView.prototype._build.apply(this)
			.addClass('multiple-choice');
	};

	MultipleChoiceOptionView.prototype._buildField = function()
	{
		// call parent
		var $element = OptionView.prototype._buildField.apply(this);
		
		// choice element
		this._$choice =
			$('<span>')
				.addClass('choice');

		this._applyValue(this._lastKnownValue);

		$element.append(
			$('<a></a>')
				.addClass('bar-button slim')
				.addClass('previous')
				.text('Previous')
				.attr('href', 'javascript:void(0);')
				.click(this.onPreviousButtonClick.bind(this)),
			this._$choice,
			$('<a></a>')
				.addClass('bar-button slim')
				.addClass('next')
				.text('Next')
				.attr('href', 'javascript:void(0);')
				.click(this.onNextButtonClick.bind(this))
		);

		return $element;
	};

	MultipleChoiceOptionView.prototype.getValue = function()
	{
		// this disables value change tracking
		//  value changes will be propagated by click event
		return this._lastKnownValue;
	};

	MultipleChoiceOptionView.prototype._applyValue = function(value)
	{
		var index = this._option.getIndexForChoice(value);
		var label = this._option.getLabelAtIndex(index);
		this._$choice.text(label);
	};

	MultipleChoiceOptionView.prototype.onNextButtonClick = function()
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

	MultipleChoiceOptionView.prototype.onPreviousButtonClick = function()
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
