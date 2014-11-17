
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.CardView = (function() { this.init.apply(this, arguments); });
	Cryptii.CardView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var CardView = Cryptii.CardView.prototype;


	CardView.init = function()
	{
		// call parent init
		View.init.apply(this, arguments);

		// attributes
		this._deckView = null;
	};

	CardView._build = function()
	{
		// call parent
		var $element = View._build.apply(this);

		// populate element
		$element
			.addClass('card')
			.append(
				this._buildHeader(),
				this._buildContent(),
				this._buildFooter()
			);

		return $element;
	};

	CardView._buildHeader = function()
	{
		return $('<div></div>')
			.addClass('card-header')
			.append(this._buildHeaderBar());
	};

	CardView._buildHeaderBar = function($header)
	{
		return $('<div></div>')
			.addClass('bar')
			.append(
				$('<a></a>')
					.addClass('bar-button icon-close')
					.click(this.onCloseButtonClick.bind(this))
					.attr({
						href: 'javascript:void(0);'
					})
			);
	};

	CardView._buildContent = function()
	{
		return $('<div></div>')
			.addClass('card-content');
	};

	CardView._buildFooter = function()
	{
		return $('<div></div>')
			.addClass('card-footer');
	};

	CardView.clearAnimations = function()
	{
		this.getElement()
			.removeClass('animation-intro')
			.removeClass('animation-outro');
	};

	CardView.triggerIntroAnimation = function()
	{
		this.getElement().addClass('animation-intro');

		// clear animation after it has been completed
		//  to prevent animations caused by dom update
		setTimeout(function() {
			this.clearAnimations();
		}.bind(this), 500);
	};

	CardView.triggerOutroAnimation = function()
	{
		this.getElement().addClass('animation-outro');
	};

	CardView.setDeckView = function(deckView)
	{
		if (this._deckView !== deckView)
		{
			this._deckView = deckView;

			if (deckView === null)
			{
				// the card has been closed
				this.onClose();
			}
		}
	};

	CardView.close = function()
	{
		if (this._deckView !== null)
		{
			// outro animation
			this.triggerOutroAnimation();

			// wait until completed
			setTimeout(function() {
				this.clearAnimations();
				this._deckView.removeCardView(this);
			}.bind(this), 500);
		}
	};

	CardView.layout = function()
	{
		
	};

	CardView.canFocus = function()
	{
		return false;
	};

	CardView.focus = function()
	{

	};

	CardView.tick = function()
	{
		// gets called regularly by a timer inside the deck
		//  to check for changes inside the view (e.g. textarea)

		// yayy, nothing to do!
	};

	//
	// delegates
	//

	CardView.onCloseButtonClick = function()
	{
		this.close();
	};

	CardView.onClose = function()
	{
		this.delegate('onCardViewClose');
	};

})(Cryptii, jQuery);
