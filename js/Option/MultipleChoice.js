
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.MultipleChoiceOption = (function() { this.init.apply(this, arguments); });
	Cryptii.MultipleChoiceOption.prototype = Object.create(Cryptii.Option.prototype);

	var Option = Cryptii.Option.prototype;
	var MultipleChoiceOption = Cryptii.MultipleChoiceOption.prototype;
	

	MultipleChoiceOption.init = function(details)
	{
		// call parent init
		Option.init.call(this, details);

		// attributes
		this._choices = [];
		this._labels = [];

		var choices = details['choices'];
		for (var value in choices)
		{
			this._choices.push(value);
			this._labels.push(choices[value]);
		}
	};

	MultipleChoiceOption._createOptionView = function()
	{
		return new Cryptii.MultipleChoiceOptionView(this);
	};


	MultipleChoiceOption.validateValue = function(value)
	{
		// this value is valid if included in choices
		if (this.getIndexForChoice(value) !== null)
		{
			return value;
		}

		return null;
	};

	MultipleChoiceOption.getIndexForChoice = function(choice)
	{
		var index = this._choices.indexOf(choice + '');

		if (index != -1) {
			return index;
		}

		return null;
	};

	//
	// accessors
	//

	MultipleChoiceOption.getChoiceCount = function()
	{
		return this._choices.length;
	};

	MultipleChoiceOption.getSelectedIndex = function()
	{
		return this._choices.indexOf(this._value);
	};

	MultipleChoiceOption.getChoiceAtIndex = function(index)
	{
		return this._choices[index];
	};

	MultipleChoiceOption.getLabelAtIndex = function(index)
	{
		return this._labels[index];
	};

})(Cryptii, jQuery);
