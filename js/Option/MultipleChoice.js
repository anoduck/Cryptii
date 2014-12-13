
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
		this._choices = details.choices || [];
		this._labels = details.labels || null;
		this._description = details.descriptions || null;

		// handle missing labels
		if (this._labels === null) {
			this._labels = [];
			for (var i = 0; i < this._choices.length; i ++) {
				this._labels.push(this._choices[i]);
			}
		}

		// handle missing descriptions
		if (this._description === null) {
			this._description = [];
			for (var i = 0; i < this._choices.length; i ++) {
				this._description.push(null);
			}
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
		var index = this._choices.indexOf(choice);

		if (index != -1) {
			return index;
		}

		return null;
	};

	//
	// accessors
	//

	MultipleChoiceOption.addChoice = function(choice, label, description)
	{
		this._choices.push(choice);
		this._labels.push(label || choice);
		this._description.push(description || null);
	};

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

	MultipleChoiceOption.getDescriptionAtIndex = function(index)
	{
		return this._description[index];
	};

})(Cryptii, jQuery);
