
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var ApplicationView = (function() {
		this._init.apply(this, arguments);
	});

	ApplicationView.prototype = Object.create(View.prototype);
	Cryptii.ApplicationView = ApplicationView;


	ApplicationView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._$main = null;

		this._sideView = null;
		this._deckView = null;

		this._isHamburgerMenuVisible = false;

		// the curtain drops
		// lets bring this beautiful app to the screen
		$('body').append(this.getElement());
	};


	ApplicationView.prototype._build = function()
	{
		// call parent
		var $element =
			View.prototype._build.apply(this)
				.attr('id', 'application');

		// build and populate main
		this._$main =
			$('<div></div>')
				.attr('id', 'main')
				.append(
					$('<button></button>')
						.addClass('hamburger')
						.click(function() {
							this.toggleHamburgerMenu();
						}.bind(this)),
					this.getDeckView().getElement(),
					$('<div></div>')
						.addClass('overlay')
						.click(function() {
							this.toggleHamburgerMenu();
						}.bind(this))
				);

		// populate element
		$element.append(
			this.getSideView().getElement(),
			this._$main
		);

		return $element;
	};

	ApplicationView.prototype.toggleHamburgerMenu = function()
	{
		this._isHamburgerMenuVisible = !this._isHamburgerMenuVisible;

		if (this._isHamburgerMenuVisible)
		{
			// show side
			this.getSideView().getElement().show();

			// animate side intro
			setTimeout(function() {
				this._$element.addClass('side-visible');
			}.bind(this), 10);
		}
		else
		{
			// animate side outro
			this._$element.removeClass('side-visible');

			// hide side
			setTimeout(function() {
				this.getSideView().getElement().hide();
			}.bind(this), 400);
		}
	};

	ApplicationView.prototype.focus = function()
	{
		// focus deck view
		this.getDeckView().focus();
	};

	ApplicationView.prototype.getSideView = function()
	{
		if (this._sideView === null) {
			this._sideView = new Cryptii.SideView();
		}

		return this._sideView;
	};

	ApplicationView.prototype.getDeckView = function()
	{
		if (this._deckView === null) {
			this._deckView = new Cryptii.DeckView();
		}

		return this._deckView;
	};

})(Cryptii, jQuery);
