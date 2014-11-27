
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
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

		this._blocks = [];
		this._difference = [];

		this._location = new Cryptii.Location();
		this._location.addDelegate(this);

		// delegates
		this._applicationView.getDeckView().addDelegate(this);
	};

	Conversation.addFormat = function(format)
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
			format.convert(this._blocks, this.calculateDifference());

			// add card of format to the deck
			this._applicationView.getDeckView().addCardView(format.getCardView());
		}
	};

	Conversation.getBlocks = function()
	{
		return this._blocks;
	}

	Conversation.setBlocks = function(blocks, triggeredByFormat)
	{
		// determin difference range
		var difference = this.calculateDifference(blocks, this._blocks);

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
					this._formats[i].convert(this._blocks, difference);
				}
			}

			this._difference = difference;
		}
	};

	Conversation.calculateDifference = function(blocks, previousBlocks)
	{
		// discussed here:
		// http://stackoverflow.com/questions/26208569

		// calling this method without any parameters
		//  returns a difference where every block changed
		if (blocks === undefined) {
			blocks = this._blocks;
		}

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

	Conversation.updateLocation = function()
	{
		// compose url
		var url = '/';

		for (var i = 0; i < this._formats.length; i ++)
		{
			var format = this._formats[i];

			// add format name
			url += (i > 0 ? '+' : '') + format.getSlug();

			// add options
			var options = format.getOptions();
			for (var name in options)
			{
				var option = options[name];

				// only add non-default options
				//  to keep the url short
				if (!option.isDefaultValue())
				{
					url += '~' + name + '=' + option.getEscapedValue();
				}
			}
		}

		// change location
		this._location.setUrl(url);
	};

	//
	// format delegates
	//

	Conversation.onFormatContentChange = function(format, blocks)
	{
		this.setBlocks(blocks, format);
	};

	Conversation.onFormatOptionChange = function(format)
	{
		this.updateLocation();
	};

	Conversation.onFormatRemove = function(format)
	{
		// remove format
		var index = this._formats.indexOf(format);
		if (index !== -1)
		{
			this._formats.splice(index, 1);
		}
	};

})(Cryptii, jQuery);
