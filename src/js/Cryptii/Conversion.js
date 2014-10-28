
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Conversation = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Conversation = Conversation;
	

	Conversation.prototype._init = function(deckView)
	{
		// attributes
		this._deckView = deckView;

		this._formats = [];
		this._blocks = [];

		this._difference = [];
	};

	Conversation.prototype.addFormat = function(format)
	{
		if (
			// check if this is a valid format
			format instanceof Cryptii.Format

			// and if this format has not already been added
			&& this._formats.indexOf(format) === -1
		) {
			// add format
			this._formats.push(format);

			// bind this
			format.setConversation(this);

			// convert
			format.convert(this, this._blocks, this._calculateDifference(this._blocks));

			// add card of format to the deck
			this._deckView.addCardView(format.getCardView());
		}
	};

	Conversation.prototype.setBlocks = function(blocks, triggeredByFormat)
	{
		// determin difference range
		var difference = this._calculateDifference(blocks, this._blocks);

		// is there a difference
		if (difference !== null)
		{
			// set blocks
			this._blocks = blocks;

			// call convert method on formats
			for (var i = 0; i < this._formats.length; i ++)
			{
				// do not call convert on the format which triggered the change
				if (this._formats[i] !== triggeredByFormat)
				{
					this._formats[i].convert(this, this._blocks, difference);
				}
			}

			this._difference = difference;
		}
	};

	Conversation.prototype._calculateDifference = function(blocks, previousBlocks)
	{
		// discussed here:
		// http://stackoverflow.com/questions/26208569

		// default state: everything has changed
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
		return new Cryptii.Difference(start, end, rangeBlocks);
	};

	//
	// event handling
	//

	Conversation.prototype.onFormatContentChange = function(format, blocks)
	{
		this.setBlocks(blocks, format);
	};

	Conversation.prototype.onFormatRemove = function(format)
	{
		// remove format
		var index = this._formats.indexOf(format);
		if (index !== -1)
		{
			this._formats.splice(index, 1);
		}
	};

})(Cryptii, jQuery);
