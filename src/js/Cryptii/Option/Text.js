
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Option = Cryptii.Option;
	var TextOption = (function() {
		this._init.apply(this, arguments);
	});

	TextOption.prototype = Object.create(Option.prototype);
	Cryptii.TextOption = TextOption;
	

	TextOption.prototype._init = function(label, value)
	{
		// call parent init
		Option.prototype._init.apply(this, arguments);

		// attributes
		this._optionView = new Cryptii.TextOptionView(this);
	};
	

	TextOption.prototype._buildContent = function()
	{
		return CardView.prototype._buildContent.apply(this)
			.append(
				$('<input>')
					.attr('type', 'text')
			);
	};

	TextOption.prototype.validateValue = function(value)
	{
		return true;
	};

})(Cryptii, jQuery);
