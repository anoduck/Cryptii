
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

		// collect option views
		this._optionViews = [];
		var options = format.getOptions();
		for (var name in options)
		{
			var optionView = options[name].getOptionView();
			this._optionViews.push(optionView);
		}
	};


	FormatCardView.prototype._buildHeader = function()
	{
		return CardView.prototype._buildHeader.apply(this)
			.append(
				$('<h3></h3>')
					.addClass('format')
					.text(this._format.getName())
			);
	};

	FormatCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

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

	FormatCardView.prototype._buildFooter = function()
	{
		return null;
	};

	FormatCardView.prototype.layout = function()
	{

	};

	FormatCardView.prototype.tick = function()
	{
		// forward tick to embedded option views
		for (var i = 0; i < this._optionViews.length; i ++)
		{
			this._optionViews[i].tick();
		}
	};

})(Cryptii, jQuery);
