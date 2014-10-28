
// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	var CardView = Cryptii.CardView;
	var FormatCardView = (function() {
		this._init.apply(this, arguments);
	});

	FormatCardView.prototype = Object.create(CardView.prototype);
	Cryptii.FormatCardView = FormatCardView;


	FormatCardView.prototype._init = function(format)
	{
		// call parent init
		CardView.prototype._init.apply(this, arguments);
		
		// attributes
		this._format = format;
	};

	FormatCardView.prototype._buildHeader = function()
	{
		return CardView.prototype._buildHeader.apply(this)
			.append(
				$('<h3></h3>')
					.addClass('format')
					.text(this._format.getTitle())
			);
	};

	FormatCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

		// append options container
		if (this._format.hasOptions())
		{
			var $options =
				$('<div></div>')
					.addClass('options');

			// append format options
			var options = this._format.getOptions();
			for (var name in options)
			{
				var optionView = options[name].getOptionView();
				$options.append(optionView.getElement());
			}

			$content.append($options);
		}

		return $content;
	};

	FormatCardView.prototype.layout = function()
	{

	};

	FormatCardView.prototype.tick = function()
	{

	};

	//
	// event handling
	//

	FormatCardView.prototype._onClose = function()
	{
		// forward to format
		this._format.onCardViewClose(this);
	};

})(Cryptii, jQuery);
