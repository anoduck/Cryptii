
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


	TextOptionView.prototype._buildField = function()
	{
		return OptionView.prototype._buildField.apply(this)
			.append(
				$('<input>')
			);
	};

})(Cryptii, jQuery);
