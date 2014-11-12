
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Option = Cryptii.Option;
	var MultipleChoiceOption = (function() {
		this._init.apply(this, arguments);
	});

	MultipleChoiceOption.prototype = Object.create(Option.prototype);
	Cryptii.MultipleChoiceOption = MultipleChoiceOption;
	

	MultipleChoiceOption.prototype._init = function(label, defaultValue, choices)
	{
		// call parent init
		Option.prototype._init.apply(this, arguments);

		// attributes
		this._choices = [];
		this._labels = [];

		for (var value in choices)
		{
			this._choices.push(value);
			this._labels.push(choices[value]);
		}
	};

	MultipleChoiceOption.prototype._createOptionView = function()
	{
		return new Cryptii.MultipleChoiceOptionView(this);
	};


	MultipleChoiceOption.prototype.validateValue = function(value)
	{
		// this value is valid if included in choices
		if (this.getIndexForChoice(value) !== null)
		{
			return value;
		}

		return null;
	};

	MultipleChoiceOption.prototype.getIndexForChoice = function(choice)
	{
		var index = this._choices.indexOf(choice);

		if (index != -1) {
			return index;
		}

		return null;
	};

	//
	// accessors
	//

	MultipleChoiceOption.prototype.getChoiceCount = function()
	{
		return this._choices.length;
	};

	MultipleChoiceOption.prototype.getSelectedIndex = function()
	{
		return this._choices.indexOf(this._value);
	};

	MultipleChoiceOption.prototype.getChoiceAtIndex = function(index)
	{
		return this._choices[index];
	};

	MultipleChoiceOption.prototype.getLabelAtIndex = function(index)
	{
		return this._labels[index];
	};

})(Cryptii, jQuery);
