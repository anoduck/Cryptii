
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.DeckView = (function() { this.init.apply(this, arguments); });
	Cryptii.DeckView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var DeckView = Cryptii.DeckView.prototype;


	DeckView.init = function()
	{
		// call parent init
		View.init.apply(this, arguments);

		// constants
		this._MIN_COLUMN_WIDTH = 375;
		this._CARD_MARGIN = 30;

		// attributes
		this._cardViews = [];
		this._$columns = null;

		this._animated = false;

		// turn on animation after the initial state has been built
		setTimeout(function() {
			this.layout();
			this._animated = true;
			this._$element.addClass('animated');
		}.bind(this), 250);
	};


	DeckView._build = function()
	{
		// call parent
		this._$element =
			View._build.apply(this)
				.attr('id', 'deck');

		// bind events
		$(window).resize(function(e) {
			this.layout();
		}.bind(this));

		this.layout();
		return this._$element;
	};

	DeckView.layout = function()
	{
		var deckWidth = this._$element.width();
		var columnCount =
			Math.max(parseInt(
				(deckWidth + this._CARD_MARGIN) /
				(this._MIN_COLUMN_WIDTH + this._CARD_MARGIN)
			), 1);
		
		// handle changes in column count
		if (
			this._$columns === null
			|| this._$columns.length != columnCount
		) {
			// detach all cards
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
							update: this.onSortableUpdate.bind(this)
						});

				this.getElement().append($column);
			}

			// bind columns
			this._$columns = this.getElement().children();

			// distribute cards to columns
			this._distributeCardView(this._cardViews, false);
		}

		// layout column width
		// when only one column is visible
		//  it takes the full width available
		if (this._$columns.length > 1)
		{
			// set a fixed column width
			var columnWidth = parseInt((deckWidth + this._CARD_MARGIN) / this._$columns.length);
			this._$columns
				.width(columnWidth - this._CARD_MARGIN)
				.addClass('fixed-width');
		}

		// layout each card view
		for (var i = 0; i < this._cardViews.length; i ++)
		{
			this._cardViews[i].layout();
		}

		// layout column height
		if (this._$columns.length > 1)
		{
			// retrieve the height of the largest column
			var maxColumnHeight = 0;
			for (var i = 0; i < this._$columns.length; i ++)
			{
				maxColumnHeight = Math.max(
					maxColumnHeight,
					this._calculateColumnHeight(i));
			}

			// set a fixed height for all columns
			//  to improve the sortable interaction
			this._$columns.height(maxColumnHeight);

			// also set a fixed height for the deck
			//  element because the columns float
			this._$element.height(maxColumnHeight);
		}
	};

	DeckView._calculateColumnHeight = function(columnIndex)
	{
		var $cardViews = $(this._$columns[columnIndex]).children();
		var height = 0;

		for (var i = 0; i < $cardViews.length; i ++)
		{
			// add up margin, card height and border width
			height += this._CARD_MARGIN + $($cardViews.get(i)).height() + 2;
		}

		return height;
	};

	DeckView._distributeCardView = function(cardView, animated, propagate)
	{
		// handle optional internal propagate parameter
		if (propagate === undefined) {
			propagate = true;
		}

		if (cardView instanceof Cryptii.CardView)
		{
			// get the smallest column element
			var $smallestColumn = null;
			var smallestColumnHeight = null;

			for (var i = 0; i < this._$columns.length; i ++)
			{
				var height = this._calculateColumnHeight(i);
				if (
					smallestColumnHeight === null
					|| height < smallestColumnHeight
				) {
					$smallestColumn = $(this._$columns[i]);
					smallestColumnHeight = height;
				}
			}

			// clear animations
			cardView.clearAnimations();

			// set animated
			if (this._animated && animated) {
				cardView.triggerIntroAnimation();
			}

			// append card to smallest column
			$smallestColumn.append(cardView.getElement());

			this.layout();
		}
		else if (Object.prototype.toString.call(cardView) === '[object Array]')
		{
			// this is an array of cards
			var cardViews = cardView;

			// distribute each card
			for (var i = 0; i < cardViews.length; i ++)
				this._distributeCardView(cardViews[i], animated, false);
		}

		if (propagate) {
			this.onChange();
		}
	};

	DeckView._redistributeCardViews = function()
	{
		// detach all cards
		for (var i = 0; i < this._cardViews.length; i ++)
			this._cardViews[i].getElement().detach();

		// distribute cards in column system
		this._distributeCardView(this._cardViews, false);
	};

	DeckView.addCardView = function(cardViews)
	{
		if (cardViews instanceof Cryptii.CardView)
		{
			// set the card's deck
			cardViews.setDeckView(this);

			this._cardViews.push(cardViews);
			this._distributeCardView(cardViews, true);
		}
	};

	DeckView.removeCardView = function(cardViews)
	{
		var index = this._cardViews.indexOf(cardViews);
		if (index !== -1)
		{
			// set the card's deck to null
			cardViews.setDeckView(null);
			cardViews.getElement().detach();

			this._cardViews.splice(index, 1);

			// reorder
			this.onChange();

			// layout
			this.layout();
		}
	};

	DeckView._mirrorCardViewOrder = function()
	{
		// reorders card views based on the elements in dom
		var orderedCardViews = [];

		// go through children of this element
		var $columns = this._$element.children();
		var indexInColumn = 0;
		var completedColumnCount = 0;

		// go through each card row
		while (completedColumnCount < $columns.length)
		{
			// reset
			completedColumnCount = 0;

			for (var i = 0; i < $columns.length; i ++)
			{
				var $cardViews = $($columns[i]).children();

				// get card view at index in column
				if (indexInColumn < $cardViews.length)
				{
					var cardView = this._findCardViewByElement(
						$($cardViews[indexInColumn]));
					orderedCardViews.push(cardView);
				}
				else
				{
					completedColumnCount ++;
				}
			}
			
			indexInColumn ++;
		}

		// replace card view array
		this._cardViews = orderedCardViews;
	};

	DeckView._findCardViewByElement = function($cardView)
	{
		var cardView = null;
		var i = 0;

		// search for a card view holding this element
		while (
			cardView === null
			&& i < this._cardViews.length
		) {
			if (this._cardViews[i].getElement().get(0) == $cardView[0])
			{
				cardView = this._cardViews[i];
			}

			i ++;
		}

		return cardView;
	};

	DeckView.tick = function()
	{
		// distribute tick to cards
		for (var i = 0; i < this._cardViews.length; i ++)
		{
			this._cardViews[i].tick();
		}
	};

	DeckView.focus = function()
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

	//
	// delegates
	//

	DeckView.onSortableUpdate = function(event, ui)
	{
		this.layout();
		this.onChange();
	};

	DeckView.onChange = function()
	{
		// reorder card views
		this._mirrorCardViewOrder();

		this.delegate('onDeckViewChange', this._cardViews);
	};

	//
	// accessors
	//

	DeckView.getCardViews = function()
	{
		return this._cardViews;
	};

})(Cryptii, jQuery);
