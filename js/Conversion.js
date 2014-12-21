
var Cryptii = Cryptii || {};

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.Conversation = (function() { this.init.apply(this, arguments); });
	Cryptii.Conversation.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Conversation = Cryptii.Conversation.prototype;
	

	Conversation.init = function(applicationView)
	{
		// call parent init
		Adam.init.call(this);
		
		// attributes
		this._applicationView = applicationView;

		this._formats = [];

		this._defaultSource = [];
		this._groupSources = {};

		// delegates
		this._applicationView.getDeckView().addDelegate(this);
	};

	Conversation.addFormat = function(format, userInteraction)
	{
		if (
			// check if this is a valid format
			format instanceof Cryptii.Format

			// and if this format has not already been added
			&& this._formats.indexOf(format) === -1
		) {
			// add format
			this._formats.push(format);

			// get format card view before setting the
			//  source to prevent a refresh conversion
			var cardView = format.getCardView();

			// set source
			format.setSource(this.getSource(format.getGroup()));

			// bind delegate
			format.addDelegate(this);
			cardView.addDelegate(this);

			// add card to deck
			this._applicationView.getDeckView().addCardView(cardView, userInteraction);
		}
	};

	Conversation.getSource = function(group)
	{
		if (this._groupSources[group] === undefined) {
			this._groupSources[group] = this._defaultSource;
		}

		return this._groupSources[group];
	};

	Conversation.setSource = function(blocks, group, triggeredByFormat)
	{
		var previousBlocks = this.getSource(group);

		// determin difference
		var difference = this.calculateDifference(blocks, previousBlocks);

		// is there a difference
		if (difference !== null)
		{
			// set blocks
			this._groupSources[group] = blocks;

			// update source on formats
			for (var i = 0; i < this._formats.length; i ++)
			{
				if (
					// only update formats of this group
					this._formats[i].getGroup() === group

					// ignore the format the update was triggered by
					&& this._formats[i] !== triggeredByFormat
				) {
					this._formats[i].setSource(blocks, difference);
				}
			}
		}
	};

	Conversation.calculateDifference = function(blocks, previousBlocks)
	{
		// discussed here:
		// http://stackoverflow.com/questions/26208569

		var length = blocks.length;
		var start = 0;
		var end = 0;

		if (previousBlocks !== null
			&& previousBlocks !== undefined
		) {
			length = Math.min(previousBlocks.length, length);

			// compare from left to right
			while (
				start < length
				&& previousBlocks[start]
					== blocks[start]
			) {
				start ++;
			}

			// compare from right to left
			while (
				end < length - start
				&& previousBlocks[previousBlocks.length - end - 1]
					=== blocks[blocks.length - end - 1]
			) {
				end ++;
			}

			// check if there is a difference
			if (end == 0
				&& start == length - 1
				&& previousBlocks.length == blocks.length
				&& previousBlocks[start] == blocks[start]
			) {
				// no difference
				return null;
			}
		}

		// collect the blocks that have been added
		var rangeBlocks = [];
		for (var i = start; i < blocks.length - end; i ++)
		{
			rangeBlocks.push(blocks[i]);
		}

		// create difference object
		return new Cryptii.Difference(rangeBlocks, start, end);
	};

	//
	// delegates
	//

	Conversation.onFormatSourceChange = function(format, blocks)
	{
		this.setSource(blocks, format.getGroup(), format);
	};

	Conversation.onFormatContentChange = function(format, content)
	{

	};

	Conversation.onCardViewClose = function(cardView)
	{
		// find format attached to this card
		var index = this._formats.indexOf(cardView.getFormat());
		if (index !== -1)
		{
			// remove format
			this._formats.splice(index, 1);
		}
	};

	//
	// accessors
	//

	Conversation.setDefaultSource = function(defaultSource)
	{
		this._defaultSource = defaultSource;
	};

})(Cryptii);
