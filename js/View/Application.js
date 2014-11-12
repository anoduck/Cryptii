
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.ApplicationView = (function() { this.init.apply(this, arguments); });
	Cryptii.ApplicationView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var ApplicationView = Cryptii.ApplicationView.prototype;


	ApplicationView.init = function()
	{
		// call parent init
		View.init.apply(this, arguments);

		// attributes
		this._$main = null;

		this._sideView = null;
		this._deckView = null;

		this._sideVisible = false;

		// the curtain drops
		// lets bring this beautiful app to the screen
		$('body').append(this.getElement());
	};


	ApplicationView._build = function()
	{
		// call parent
		var $element =
			View._build.apply(this)
				.attr('id', 'application');

		// build and populate main
		this._$main =
			$('<div></div>')
				.attr('id', 'main')
				.append(
					$('<button></button>')
						.addClass('hamburger')
						.click(function() {
							this.toggleSide();
						}.bind(this)),
					this.getDeckView().getElement(),
					$('<div></div>')
						.addClass('overlay')
						.click(function() {
							this.toggleSide();
						}.bind(this))
				);

		// populate element
		$element.append(
			this.getSideView().getElement(),
			this._$main
		);

		return $element;
	};

	ApplicationView.toggleSide = function()
	{
		this._sideVisible = !this._sideVisible;

		if (this._sideVisible)
		{
			// show side
			this.getSideView().setHidden(false);

			// animate side intro after showing element
			setTimeout(function() {
				this._$element.addClass('side-visible');
			}.bind(this), 10);
		}
		else
		{
			// animate side outro
			this._$element.removeClass('side-visible');

			// hide side after animation
			setTimeout(function() {
				this.getSideView().setHidden(true);
			}.bind(this), 400);
		}
	};

	ApplicationView.tick = function()
	{
		// forward to deck view
		if (this._deckView !== null) {
			this._deckView.tick();
		}

		// forward to side view
		if (this._sideView !== null) {
			this._sideView.tick();
		}
	};

	ApplicationView.focus = function()
	{
		// focus deck view
		this.getDeckView().focus();
	};

	//
	// delegates
	//

	ApplicationView.onSideViewClose = function(Format)
	{
		this.toggleSide();
	};

	//
	// accessors
	//

	ApplicationView.getSideView = function()
	{
		if (this._sideView === null) {
			this._sideView = new Cryptii.SideView();
			this._sideView.addDelegate(this);
		}

		return this._sideView;
	};

	ApplicationView.getDeckView = function()
	{
		if (this._deckView === null) {
			this._deckView = new Cryptii.DeckView();
		}

		return this._deckView;
	};

})(Cryptii, jQuery);
