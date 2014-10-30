
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
		this._MIN_COLUMN_WIDTH = 400;
		this._COLUMN_MARGIN = 30;
		this._TICK_INTERVAL = 1000;

		// attributes
		this._cardViews = [];

		this._columnCount = 0;
		this._columnCardDistributeIndex = 0;

		this._tickTimer = setInterval(
			this._tick.bind(this),
			this._TICK_INTERVAL);

		// turn on animation after the initial state has been built
		setTimeout(function() {
			this._$element.addClass('animated');
		}.bind(this), 500);
	};

	DeckView.prototype._build = function()
	{
		this._$element = $('#deck');

		// bind events
		$(window).resize(function(e) {
			this.layout();
		}.bind(this));

		this.layout();
		return this._$element;
	};

	DeckView.prototype.layout = function()
	{
		var width = $(window).width();
		var columnCount = Math.max(parseInt((width - this._COLUMN_MARGIN) / (this._MIN_COLUMN_WIDTH + this._COLUMN_MARGIN)), 1);
		
		// check if column count has changed
		if (this._columnCount != columnCount)
		{
			this._columnCount = columnCount;

			// detach all cards
			this._columnCardDistributeIndex = 0;
			for (var i = 0; i < this._cardViews.length; i ++)
				this._cardViews[i].getElement().detach();

			// build columns
			this.getElement().empty();

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
							items: '> .card'
						});

				this.getElement().append($column);
			}

			// distribute cards in column system
			this._distributeCardView(this._cardViews);
		}

		// resize columns
		var columnWidth = parseInt((width - this._COLUMN_MARGIN) / columnCount);
		this.getElement().children().width(columnWidth - this._COLUMN_MARGIN);

		// layout each card view
		for (var i = 0; i < this._cardViews.length; i ++)
		{
			this._cardViews[i].layout();
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

	DeckView.prototype._tick = function()
	{
		// distribute tick to all cards
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
		}
	};

	DeckView.prototype.focus = function()
	{
			// focus first card view that can be focused
		if (this._cardViews.length > 0)
		{
			var i = 0;
			while (
				i < this._cardViews.length
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
