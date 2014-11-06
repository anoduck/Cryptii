
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var DeckView = (function() {
		this._init.apply(this, arguments);
	});

	DeckView.prototype = Object.create(View.prototype);
	Cryptii.DeckView = DeckView;


	DeckView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// constants
		this._MIN_COLUMN_WIDTH = 350;
		this._CARD_MARGIN = 30;

		// attributes
		this._cardViews = [];

		this._columnCount = 0;
		this._columnCardDistributeIndex = 0;

		// turn on animation after the initial state has been built
		setTimeout(function() {
			this._$element.addClass('animated');
		}.bind(this), 500);
	};

	DeckView.prototype._build = function()
	{
		// call parent
		this._$element =
			View.prototype._build.apply(this)
				.attr('id', 'deck');

		// bind events
		$(window).resize(function(e) {
			this.layout();
		}.bind(this));

		this.layout();
		return this._$element;
	};

	DeckView.prototype.layout = function()
	{
		var deckWidth = this._$element.width();
		var columnCount =
			Math.max(parseInt(
				(deckWidth + this._CARD_MARGIN) /
				(this._MIN_COLUMN_WIDTH + this._CARD_MARGIN)
			), 1);
		
		// handle changes in column count
		if (this._columnCount != columnCount)
		{
			this._columnCount = columnCount;

			// detach all cards
			this._columnCardDistributeIndex = 0;
			for (var i = 0; i < this._cardViews.length; i ++)
				this._cardViews[i].getElement().detach();

			// remove all columns
			this.getElement().empty();

			// build columns
			for (var i = 0; i < columnCount; i ++)
			{
				var $column =
					$('<div></div>')
						.addClass('column')
						.sortable({
							connectWith: '.column',
							handle: '.header',
							cancel: 'a',
							placeholder: 'card ghost',
							distance: 10,
							items: '> .card',
							update: function(event, ui) {
								this.layout();
							}.bind(this)
						});

				this.getElement().append($column);
			}

			// distribute cards to columns
			this._distributeCardView(this._cardViews);
		}

		// get visible columns
		var $columns = this.getElement().children();

		// layout column width
		// when only one column is visible
		//  it takes the full width available
		if (this._columnCount > 1)
		{
			// set a fixed column width
			var columnWidth = parseInt((deckWidth + this._CARD_MARGIN) / columnCount);
			$columns
				.width(columnWidth - this._CARD_MARGIN)
				.addClass('fixed-width');
		}

		// layout each card view
		for (var i = 0; i < this._cardViews.length; i ++)
		{
			this._cardViews[i].layout();
		}

		// layout column height
		if (this._columnCount > 1)
		{
			// retrieve the height of the largest column
			var maxColumnHeight = 0;
			for (var i = 0; i < $columns.length; i ++)
			{
				var $column = $($columns.get(i));
				var $cards = $column.children();

				// mesure the height of this column
				var height = 0;
				for (var j = 0; j < $cards.length; j ++)
				{
					// add up margin card height and border width
					height += this._CARD_MARGIN + $($cards.get(j)).height() + 2;
				}

				maxColumnHeight = Math.max(maxColumnHeight, height);
			}

			// set a fixed height for all columns
			//  to improve the sortable interaction
			$columns.height(maxColumnHeight);

			// also set a fixed height for the deck
			//  element because the columns float
			this._$element.height(maxColumnHeight);
		}
	};

	DeckView.prototype._distributeCardView = function(cardView)
	{
		if (cardView instanceof Cryptii.CardView)
		{
			// calculate the column index where the card should appear
			var columnIndex = (this._columnCardDistributeIndex ++) % this._columnCount;

			// append card to column
			var $column = $(this.getElement().children().get(columnIndex));
			$column.append(cardView.getElement());

			this.layout();
		}
		else if (Object.prototype.toString.call(cardView) === '[object Array]')
		{
			// this is an array of cards
			var cardViews = cardView;

			// distribute each card
			for (var i = 0; i < cardViews.length; i ++)
				this._distributeCardView(cardViews[i]);
		}
	};

	DeckView.prototype._redistributeCardViews = function()
	{
		// detach all cards
		this._columnCardDistributeIndex = 0;
		for (var i = 0; i < this._cardViews.length; i ++)
			this._cardViews[i].getElement().detach();

		// distribute cards in column system
		this._distributeCardView(this._cardViews);
	};

	DeckView.prototype.tick = function()
	{
		// distribute tick to cards
		for (var i = 0; i < this._cardViews.length; i ++)
		{
			this._cardViews[i].tick();
		}
	};

	DeckView.prototype.addCardView = function(cardViews)
	{
		if (cardViews instanceof Cryptii.CardView)
		{
			// set the card's deck
			cardViews.setDeckView(this);

			this._cardViews.push(cardViews);
			this._distributeCardView(cardViews);
		}
	};

	DeckView.prototype.removeCardView = function(cardViews)
	{
		var index = this._cardViews.indexOf(cardViews);
		if (index !== -1)
		{
			// set the card's deck to null
			cardViews.setDeckView(null);
			cardViews.getElement().detach();

			this._cardViews.splice(index, 1);

			// redistribute cards
			this._redistributeCardViews();

			// layout
			this.layout();
		}
	};

	DeckView.prototype.focus = function()
	{
			// focus first card view that can be focused
		if (this._cardViews.length > 0)
		{
			var i = 0;
			while (
				i < this._cardViews.length - 1
				&& !this._cardViews[i].canFocus()
			) {
				i ++;
			}

			if (this._cardViews[i].canFocus()) {
				this._cardViews[i].focus();
			}
		}
	};

})(Cryptii, jQuery);
