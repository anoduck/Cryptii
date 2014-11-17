
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

		this._$options = null;
		this._$optionBarButton = null;

		this._optionalsHidden = true;
	};


	FormatCardView._buildHeaderBar = function($header)
	{
		if (this._format.getOptionalOptionCount() > 0)
		{
			this._$optionBarButton = $('<a></a>')
				.click(this.onOptionBarButtonClick.bind(this))
				.addClass('bar-button icon-option')
				.attr({
					href: 'javascript:void(0);'
				});

			if (!this._optionalsHidden) {
				this._$optionBarButton.addClass('selected');
			}
		}

		return CardView._buildHeaderBar.apply(this)
			.prepend(this._$optionBarButton);
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
		if (this._format.hasOptions())
		{
			var options = this._format.getOptions();

			// options inner element
			var $optionsInner =
				$('<div></div>')
					.addClass('inner');

			// append each option view to container
			for (var name in options)
			{
				var optionView = options[name].getOptionView();
				$optionsInner.append(optionView.getElement());
			}

			// options element
			this._$options =
				$('<div></div>')
					.addClass('options')
					.append($optionsInner);

			if (this._optionalsHidden)
			{
				if (this._format.getOptionCount() == this._format.getOptionalOptionCount()) {
					this._$options.addClass('hidden');
				} else {
					this._$options.addClass('hide-optionals');
				}
			}

			// append options
			$content.append(this._$options);
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
		for (var name in this._options) {
			this._options[name].getOptionView().tick();
		}
	};

	FormatCardView.setOptionalsHidden = function(optionalsHidden)
	{
		if (
			this._optionalsHidden != optionalsHidden
			&& this._$options !== null
		) {
			this._optionalsHidden = optionalsHidden;

			if (optionalsHidden)
			{
				this._$optionBarButton.removeClass('selected');
			}
			else
			{
				this._$optionBarButton.addClass('selected');
			}

			if (this._format.getOptionCount() == this._format.getOptionalOptionCount())
			{
				if (optionalsHidden)
				{
					this._$options.addClass('hidden');
				}
				else
				{
					this._$options.removeClass('hidden');
				}
			}
			else
			{
				if (optionalsHidden)
				{
					this._$options.addClass('hide-optionals');
					
				}
				else
				{
					this._$options.removeClass('hide-optionals');
				}
			}
		}
	};

	FormatCardView.toggleOptionalsHidden = function()
	{
		this.setOptionalsHidden(!this._optionalsHidden);
	};

	FormatCardView.onOptionBarButtonClick = function(evt)
	{
		this.toggleOptionalsHidden();
	};

})(Cryptii, jQuery);
