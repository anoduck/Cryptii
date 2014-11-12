
// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.FormatCardView = (function() { this.init.apply(this, arguments); });
	Cryptii.FormatCardView.prototype = Object.create(Cryptii.CardView.prototype);

	var CardView = Cryptii.CardView.prototype;
	var FormatCardView = Cryptii.FormatCardView.prototype;


	FormatCardView.init = function(format)
	{
		// call parent init
		CardView.init.apply(this, arguments);
		
		// attributes
		this._format = format;

		// collect option views
		this._optionViews = [];
		var options = format.getOptions();
		for (var name in options)
		{
			var optionView = options[name].getOptionView();
			this._optionViews.push(optionView);
		}
	};


	FormatCardView._buildHeader = function()
	{
		return CardView._buildHeader.apply(this)
			.append(
				$('<h3></h3>')
					.addClass('format')
					.text(this._format.getName())
			);
	};

	FormatCardView._buildContent = function()
	{
		var $content = CardView._buildContent.apply(this);

		// handle format options
		if (this._optionViews.length > 0)
		{
			var $options =
				$('<div></div>')
					.addClass('options');

			// append option views to container
			for (var i = 0; i < this._optionViews.length; i ++) {
				$options.append(this._optionViews[i].getElement());
			}

			// append options
			$content.append($options);
		}

		return $content;
	};

	FormatCardView._buildFooter = function()
	{
		return null;
	};

	FormatCardView.layout = function()
	{

	};

	FormatCardView.tick = function()
	{
		// forward tick to embedded option views
		for (var i = 0; i < this._optionViews.length; i ++)
		{
			this._optionViews[i].tick();
		}
	};

})(Cryptii, jQuery);
