
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var CardView = (function() {
		this._init.apply(this, arguments);
	});

	CardView.prototype = Object.create(View.prototype);
	Cryptii.CardView = CardView;


	CardView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._deckView = null;
	};

	CardView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

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

	CardView.prototype._buildHeader = function()
	{
		return $('<div></div>')
			.addClass('header')
			.append(this._buildRightToolbar());
	};

	CardView.prototype._buildRightToolbar = function($header)
	{
		return $('<div></div>')
			.addClass('toolbar')
			.addClass('right')
			.append(
				$('<a></a>')
					.attr({
						href: 'javascript:void(0);'
					})
					.on('click', $.proxy(function() {
						this.close();
					}, this))
					.addClass('item')
					.addClass('close')
			);
	};

	CardView.prototype._buildContent = function()
	{
		return $('<div></div>')
			.addClass('content');
	};

	CardView.prototype._buildFooter = function()
	{
		return $('<div></div>')
			.addClass('footer');
	};

	CardView.prototype.clearAnimations = function()
	{
		this.getElement()
			.removeClass('animation-intro')
			.removeClass('animation-outro');
	};

	CardView.prototype.triggerIntroAnimation = function()
	{
		this.getElement().addClass('animation-intro');

		// clear animation after it has been completed
		//  to prevent animations caused by dom update
		setTimeout(function() {
			this.clearAnimations();
		}.bind(this), 500);
	};

	CardView.prototype.triggerOutroAnimation = function()
	{
		this.getElement().addClass('animation-outro');
	};

	CardView.prototype.setDeckView = function(deckView)
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

	CardView.prototype.close = function()
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

	CardView.prototype.layout = function()
	{
		
	};

	CardView.prototype.canFocus = function()
	{
		return false;
	};

	CardView.prototype.focus = function()
	{

	};

	CardView.prototype.tick = function()
	{
		// gets called regularly by a timer inside the deck
		//  to check for changes inside the view (e.g. textarea)

		// yayy, nothing to do!
	};

	//
	// delegates
	//

	CardView.prototype.onClose = function()
	{
		this.delegate('onCardViewClose');
	};

})(Cryptii, jQuery);
