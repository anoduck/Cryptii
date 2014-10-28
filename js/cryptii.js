
var Cryptii = Cryptii || {};

jQuery(function($) {
	'use strict';

	new Cryptii.Application();

});

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Application = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Application = Application;


	Application.prototype._init = function()
	{
		this._deckView = new Cryptii.DeckView();
		this._conversation = new Cryptii.Conversation(this._deckView);

		// default blocks
		this._conversation.setBlocks([
			84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114,
			111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112,
			115, 32, 111, 118, 101, 114, 32, 49, 51, 32, 108, 97,
			122, 121, 32, 100, 111, 103, 115, 46
		]);

		// add example cards
		this._conversation.addFormat(new Cryptii.TextFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.BinaryFormat());
		this._conversation.addFormat(new Cryptii.HexadecimalFormat());
		this._conversation.addFormat(new Cryptii.OctalFormat());
	};

})(Cryptii, jQuery);

;


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

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Difference = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Difference = Difference;
	

	Difference.prototype._init = function(startOffset, endOffset, blocks)
	{
		// attributes
		this._startOffset = startOffset;
		this._endOffset = endOffset;
		this._blocks = blocks;
	};

	Difference.prototype.getStartOffset = function()
	{
		return this._startOffset;
	};

	Difference.prototype.getEndOffset = function()
	{
		return this._endOffset;
	};

	Difference.prototype.getBlocks = function()
	{
		return this._blocks;
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Format = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Format = Format;
	

	Format.prototype._init = function(options)
	{
		// attributes
		this._cardView = null;
		this._conversation = null;

		// format options
		this._options = {};
	};

	Format.prototype.getTitle = function()
	{
		return 'Untitled';
	};

	Format.prototype.interpret = function(content)
	{
		// not implemented
		return [];
	};

	Format.prototype.convert = function(conversion)
	{
		// not implemented
	};

	//
	// event handling
	//

	Format.prototype.onComposerViewChange = function(composerView, content)
	{
		var time = new Date().getTime();

		// interpret content
		var blocks = this.interpret(content);

		// fire event
		this._conversion.onFormatContentChange(this, blocks);
		
		var delta = new Date().getTime() - time;
		console.log('Time: ' + delta + 'ms');
	};

	Format.prototype.onComposerViewSelect = function(composerView, range)
	{

	};

	Format.prototype.onCardViewClose = function()
	{
		// forward to conversation
		this._conversion.onFormatRemove(this);
	};

	//
	// getters and setters
	//

	Format.prototype.setConversation = function(conversion)
	{
		this._conversion = conversion;
	};

	Format.prototype.getCardView = function()
	{
		return this._cardView;
	};

	Format.prototype.getComposerView = function()
	{
		return this.getCardView().getComposerView();
	};

	Format.prototype.getHighlighterElement = function()
	{
		return this.getCardView().getComposerView().getHighlighterElement();
	};

	Format.prototype.getOptionValue = function(name)
	{
		return this._options[name].getValue();
	};

	Format.prototype.hasOptions = function()
	{
		var count = 0;
		for (name in this._options)
		{
			count ++;
		}

		return count !== 0;
	};

	Format.prototype.getOptions = function()
	{
		return this._options;
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Option = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Option = Option;
	

	Option.prototype._init = function(label, value)
	{
		// attributes
		this._label = label;
		this._value = value;

		this._optionView = null;
	};


	Option.prototype.getLabel = function()
	{
		return this._label;
	};

	Option.prototype.isValueValid = function(value)
	{
		// the base class validates every value
		return true;
	};

	Option.prototype.getValue = function()
	{
		return this._value;
	};

	Option.prototype.setValue = function(value)
	{
		if (this.isValueValid(value))
		{
			this._value = value;
			return true;
		}

		return false;
	};

	Option.prototype.getOptionView = function()
	{
		return this._optionView;
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Range = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Range = Range;
	

	Range.prototype._init = function(start, end)
	{
		// attributes
		this._start = start;
		this._end = end;
	};

	Range.prototype.getStart = function()
	{
		return this._start;
	};

	Range.prototype.getLength = function()
	{
		return this._end - this._start;
	};

	Range.prototype.getEnd = function()
	{
		return this._end;
	};

	Range.prototype.isEqualTo = function(range)
	{
		return (
			range != null
			&& range.getStart() == this.getStart()
			&& range.getEnd() == this.getEnd()
		);
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.View = View;
	

	View.prototype._init = function()
	{
		// attributes
		this._$element = null;
	};

	View.prototype._build = function()
	{
		// create element
		var $element = $('<div></div>');

		return $element;

	};

	View.prototype.getElement = function()
	{
		if (this._$element === null)
		{
			this._$element = this._build();
		}

		return this._$element;
	};

	View.prototype.forceRepaint = function()
	{
		// using many dom elements can cause missing repaint events
		// http://stackoverflow.com/questions/3485365
		var element = this._$element[0];
		element.style.display = 'none';
		element.offsetHeight;
		element.style.display = '';
	};

})(Cryptii, jQuery);

;


// requires Cryptii.Format

(function(Cryptii, $) {
	'use strict';

	// define class
	var Format = Cryptii.Format;
	var TextFormat = (function() {
		this._init.apply(this, arguments);
	});

	TextFormat.prototype = Object.create(Format.prototype);
	Cryptii.TextFormat = TextFormat;


	TextFormat.prototype._init = function(options)
	{
		// call parent init
		Format.prototype._init.apply(this, arguments);

		// attributes
		this._cardView = new Cryptii.TextFormatCardView(this);
		this._blockMeta = [];
	};


	TextFormat.prototype.getTitle = function()
	{
		return 'Text';
	};

	TextFormat.prototype._getSeparator = function()
	{
		return null;
	};

	TextFormat.prototype._getSeparatorLength = function()
	{
		return (this._getSeparator() !== null ? this._getSeparator().length : 0);
	};

	TextFormat.prototype.createBlockElement = function(decimal, contentBlock)
	{
		return $(decimal !== null ? '<b></b>' : '<i></i>').text(contentBlock);
	};

	TextFormat.prototype.createSeparatorElement = function()
	{
		var separator = this._getSeparator();

		if (separator === null)
		{
			return null;
		}

		return $('<u>' + separator + '</u>');
	};

	TextFormat.prototype.interpretBlock = function(contentBlock)
	{
		return contentBlock.charCodeAt(0);
	};

	TextFormat.prototype.convertBlock = function(decimal)
	{
		return String.fromCharCode(decimal);
	};

	TextFormat.prototype.blockRangeByContentRange = function(contentRange)
	{
		var separatorLength = this._getSeparatorLength();

		var index = 0;
		var contentIndex = 0;
		var start = null;

		while (
			index < this._blockMeta.length
			&& contentIndex < contentRange.getEnd()
		) {
			index += 1;
			contentIndex += this._blockMeta[index].content.length + separatorLength;

			if (
				start === null
				&& contentIndex > contentRange.getStart()
			) {
				start = index;
			}
		}

		return new Cryptii.Range(start, index);
	};

	TextFormat.prototype.contentRangeByBlockRange = function(blockRange)
	{
		var separatorLength = this._getSeparatorLength();

		var contentIndex = 0;
		var start = null;

		for (var index = 0; index < blockRange.getEnd(); index ++) {
			contentIndex += this._blockMeta[index].content.length + separatorLength;

			if (index == blockRange.getStart())
			{
				start = contentIndex;
			}
		}

		return new Cryptii.Range(start, contentIndex);
	};

	TextFormat.prototype.interpret = function(content)
	{
		var separator = this._getSeparator();

		var $highlighter = this.getHighlighterElement();

		// clear highlighter
		$highlighter.empty();

		var blockMeta = [];
		var blocks = [];

		// get content blocks by separator
		var contentBlocks = (separator === null ? content : content.split(separator));

		for (var i = 0; i < contentBlocks.length; i ++)
		{
			var contentBlock = contentBlocks[i];
			var decimal = this.interpretBlock(contentBlock);

			// create highlighter elements
			var $block = this.createBlockElement(decimal, contentBlock);
			var $separator = this.createSeparatorElement();
			$highlighter.append($block, $separator);

			// store data
			blocks.push(decimal);
			blockMeta.push({
				content: '' + contentBlock,
				element: $block,
				separatorElement: $separator
			});
		}

		this._blockMeta = blockMeta;

		return blocks;
	};

	TextFormat.prototype.convert = function(conversion, blocks, difference)
	{
		var separator = this._getSeparator();
		var separatorLength = this._getSeparatorLength();

		var composerView = this.getComposerView();
		var $highlighter = this.getHighlighterElement();

		// determin unchanged content parts
		var lastContent = composerView.getContent();
		var leftUnchangedContent = lastContent;
		var rightUnchangedContent = lastContent;

		// left unchanged content part
		if (difference.getStartOffset() != this._blockMeta.length)
		{
			var contentStartLength = 0;
			for (var i = 0; i < difference.getStartOffset(); i ++) {
				contentStartLength += this._blockMeta[i].content.length + separatorLength;
			}

			leftUnchangedContent = lastContent.substr(0, contentStartLength);
		}

		// right unchanged content part
		if (difference.getEndOffset() != this._blockMeta.length)
		{
			var contentEndIndex = lastContent.length;
			for (var i = 0; i < difference.getEndOffset(); i ++) {
				contentEndIndex -= this._blockMeta[this._blockMeta.length - 1 - i].content.length + separatorLength;
			}

			rightUnchangedContent = lastContent.substr(contentEndIndex);
		}

		// compose content and update highlighting elements
		var content = leftUnchangedContent;

		// remove blocks in changing range
		for (var i = this._blockMeta.length - difference.getEndOffset() - 1; i >= difference.getStartOffset(); i --)
		{
			// remove highlighter elements from dom
			this._blockMeta[i].element.remove();

			if (this._blockMeta[i].separatorElement !== null) {
				this._blockMeta[i].separatorElement.remove();
			}
		
			this._blockMeta.splice(i, 1);
		}

		// collect new elements and add up content
		var elements = [];
		var replacementBlocks = difference.getBlocks();

		for (var i = 0; i < replacementBlocks.length; i ++)
		{
			var index = difference.getStartOffset() + i;
			var decimal = replacementBlocks[i];
			var contentBlock = this.convertBlock(decimal);

			// create highlighter elements
			var $block = this.createBlockElement(decimal, contentBlock);
			var $separator = this.createSeparatorElement();

			// add content block
			content += contentBlock;
			elements.push($block[0]);

			// add separator
			if (separator !== null)
			{
				content += separator;
				elements.push($separator[0]);
			}

			// store data
			this._blockMeta.splice(index, 0, {
				content: '' + contentBlock,
				element: $block,
				separatorElement: $separator
			});
		}

		// insert elements
		if (difference.getStartOffset() > 0)
		{
			// append after element
			var blockBefore = this._blockMeta[difference.getStartOffset() - 1];
			var $before = (blockBefore.separatorElement !== null ? blockBefore.separatorElement : blockBefore.element);
			$before.after(elements)
		}
		else
		{
			// prepent to parent
			$highlighter.prepend(elements);
		}

		// add right unchanged content part
		content += rightUnchangedContent;

		// force repaint
		composerView.forceRepaint();

		// update content
		composerView.setContent(content);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.TextFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var TextFormat = Cryptii.TextFormat;
	var DecimalFormat = (function() {
		this._init.apply(this, arguments);
	});

	DecimalFormat.prototype = Object.create(TextFormat.prototype);
	Cryptii.DecimalFormat = DecimalFormat;


	DecimalFormat.prototype._init = function(options)
	{
		// call parent init
		TextFormat.prototype._init.apply(this, arguments);

		// attributes
		this._options['separator'] = new Cryptii.TextOption('Separator', ' ');
	};


	DecimalFormat.prototype.getTitle = function()
	{
		return 'Decimal';
	};

	DecimalFormat.prototype._getSeparator = function()
	{
		return this.getOptionValue('separator');
	};

	DecimalFormat.prototype.interpretBlock = function(contentBlock)
	{
		if (!isNaN(contentBlock))
		{
			return parseInt(contentBlock);
		}

		return null;
	};

	DecimalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal;
	};

})(Cryptii, jQuery);

;


// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var BinaryFormat = (function() {
		this._init.apply(this, arguments);
	});

	BinaryFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.BinaryFormat = BinaryFormat;


	BinaryFormat.prototype.getTitle = function()
	{
		return 'Binary';
	};

	BinaryFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 2);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	BinaryFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(2);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var HexadecimalFormat = (function() {
		this._init.apply(this, arguments);
	});

	HexadecimalFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.HexadecimalFormat = HexadecimalFormat;


	HexadecimalFormat.prototype.getTitle = function()
	{
		return 'Hexadecimal';
	};

	HexadecimalFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 16);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	HexadecimalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(16);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.DecimalFormat

(function(Cryptii, $) {
	'use strict';

	// define class
	var DecimalFormat = Cryptii.DecimalFormat;
	var OctalFormat = (function() {
		this._init.apply(this, arguments);
	});

	OctalFormat.prototype = Object.create(DecimalFormat.prototype);
	Cryptii.OctalFormat = OctalFormat;


	OctalFormat.prototype.getTitle = function()
	{
		return 'Octal';
	};

	OctalFormat.prototype.interpretBlock = function(contentBlock)
	{
		var decimal = parseInt(contentBlock, 8);

		if (!isNaN(decimal))
		{
			return decimal;
		}

		return null;
	};

	OctalFormat.prototype.convertBlock = function(decimal)
	{
		return decimal.toString(8);
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Option = Cryptii.Option;
	var TextOption = (function() {
		this._init.apply(this, arguments);
	});

	TextOption.prototype = Object.create(Option.prototype);
	Cryptii.TextOption = TextOption;
	

	TextOption.prototype._init = function(label, value)
	{
		// call parent init
		Option.prototype._init.apply(this, arguments);

		// attributes
		this._optionView = new Cryptii.TextOptionView(this);
	};
	

	TextOption.prototype._buildContent = function()
	{
		return CardView.prototype._buildContent.apply(this)
			.append(
				$('<input>')
					.attr('type', 'text')
			);
	};

	TextOption.prototype.validateValue = function(value)
	{
		return true;
	};

})(Cryptii, jQuery);

;


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
				this._buildContent()
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

	CardView.prototype.setDeckView = function(deckView)
	{
		if (this._deckView !== deckView)
		{
			this._deckView = deckView;

			if (deckView === null)
			{
				// the card has been closed
				this._onClose();
			}
		}
	};

	CardView.prototype.close = function()
	{
		if (this._deckView !== null)
		{
			this._deckView.removeCardView(this);
		}
	};

	CardView.prototype.layout = function()
	{
		
	};

	CardView.prototype.tick = function()
	{
		// gets called regularly by a timer inside the deck
		//  to check for changes inside the view (e.g. textarea)

		// yayy, nothing to do!
	};

	//
	// event handling
	//

	CardView.prototype._onClose = function()
	{
		
	};

})(Cryptii, jQuery);

;


// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var ComposerView = (function() {
		this._init.apply(this, arguments);
	});

	ComposerView.prototype = Object.create(View.prototype);
	Cryptii.ComposerView = ComposerView;


	ComposerView.prototype._init = function(cardView)
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._cardView = cardView;

		this._$highlighter = null;
		this._$textarea = null;

		this._lastKnownContent = '';
		this._lastKnownSelection = null;
	};

	ComposerView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// textarea element
		this._$textarea =
			$('<textarea></textarea>')
				.attr({
					spellcheck: 'false'
				})
				.keyup(this._trackChanges.bind(this));

		// highlighter element
		this._$highlighter =
			$('<div></div>')
				.addClass('highlighter');

		// populate element
		$element
			.addClass('composer')
			.append(
				this._$textarea,
				this._$highlighter
			);

		// events
		$element.on('click', $.proxy(function() {
			this._$textarea.focus();
		}, this));

		return $element;
	};

	ComposerView.prototype.layout = function()
	{
		// set the height of the textarea
		var height = this._$highlighter.height() + 50;
		this._$textarea.height(height);
	};

	ComposerView.prototype.tick = function()
	{
		this._trackChanges();
	};

	ComposerView.prototype._trackChanges = function()
	{
		var content = this.getContent();
		var selection = this.getSelection();

		// check if the content has been changed
		if (content != this._lastKnownContent)
		{
			this._lastKnownContent = content;

			// fire event
			this._cardView.onComposerViewChange(this, content);

			// the content size depends on the actual content
			this.layout();
		}

		// check if the selection has been changed
		if (
			(selection === null) != (this._lastKnownSelection === null)
			|| (selection !== null && !selection.isEqualTo(this._lastKnownSelection))
		) {
			this._lastKnownSelection = selection;

			// fire event
			this._cardView.onComposerViewSelect(this, selection);
		}
	}

	ComposerView.prototype.getHighlighterElement = function()
	{
		// builds the element if necessary
		this.getElement();

		return this._$highlighter;
	};

	ComposerView.prototype.getContent = function()
	{
		// builds the element if necessary
		this.getElement();

		return this._$textarea.val();
	};

	ComposerView.prototype.setContent = function(content)
	{
		// builds the element if necessary
		this.getElement();

		this._$textarea.val(content);
		this._lastKnownContent = content;

		// the content size depends on the actual content
		// because of changes in highlighter dom, call this async
		setTimeout(function() {
			this.layout();
		}.bind(this), 1);
	};

	ComposerView.prototype.getSelection = function()
	{
		// get native textarea element
		var textarea = this._$textarea[0];
		var start = 0;
		var end = 0;

		if ('selectionStart' in textarea)
		{
			start = textarea.selectionStart;
			end = textarea.selectionEnd;
		}
		else
		{
			var range = document.selection.createRange();
			if (range.parentElement() == textarea)
			{
				start = range.startOffset;
				end = range.endOffset;
			}
		}

		if (start != end)
		{
			return new Cryptii.Range(start, end);
		}

		return null;
	};

})(Cryptii, jQuery);

;


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
						.addClass('column');

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

})(Cryptii, jQuery);

;


// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var OptionView = (function() {
		this._init.apply(this, arguments);
	});

	OptionView.prototype = Object.create(View.prototype);
	Cryptii.OptionView = OptionView;


	OptionView.prototype._init = function(option)
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._option = option;
	};

	OptionView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// populate element
		$element
			.addClass('option')
			.append(
				this._buildLabel(),
				this._buildField()
			);

		return $element;
	};

	OptionView.prototype._buildLabel = function()
	{
		return $('<label></label>')
			.text(this._option.getLabel());
	};

	OptionView.prototype._buildField = function()
	{
		return $('<div></div>')
			.addClass('field');
	};

})(Cryptii, jQuery);

;


// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	var CardView = Cryptii.CardView;
	var FormatCardView = (function() {
		this._init.apply(this, arguments);
	});

	FormatCardView.prototype = Object.create(CardView.prototype);
	Cryptii.FormatCardView = FormatCardView;


	FormatCardView.prototype._init = function(format)
	{
		// call parent init
		CardView.prototype._init.apply(this, arguments);
		
		// attributes
		this._format = format;
	};

	FormatCardView.prototype._buildHeader = function()
	{
		return CardView.prototype._buildHeader.apply(this)
			.append(
				$('<h3></h3>')
					.addClass('format')
					.text(this._format.getTitle())
			);
	};

	FormatCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

		// append options container
		if (this._format.hasOptions())
		{
			var $options =
				$('<div></div>')
					.addClass('options');

			// append format options
			var options = this._format.getOptions();
			for (var name in options)
			{
				var optionView = options[name].getOptionView();
				$options.append(optionView.getElement());
			}

			$content.append($options);
		}

		return $content;
	};

	FormatCardView.prototype.layout = function()
	{

	};

	FormatCardView.prototype.tick = function()
	{

	};

	//
	// event handling
	//

	FormatCardView.prototype._onClose = function()
	{
		// forward to format
		this._format.onCardViewClose(this);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.OptionView

(function(Cryptii, $) {
	'use strict';

	// define class
	var OptionView = Cryptii.OptionView;
	var TextOptionView = (function() {
		this._init.apply(this, arguments);
	});

	TextOptionView.prototype = Object.create(OptionView.prototype);
	Cryptii.TextOptionView = TextOptionView;


	TextOptionView.prototype._buildField = function()
	{
		return OptionView.prototype._buildField.apply(this)
			.append(
				$('<input>')
			);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.FormatCardView

(function(Cryptii, $) {
	'use strict';

	// define class
	var FormatCardView = Cryptii.FormatCardView;
	var TextFormatCardView = (function() {
		this._init.apply(this, arguments);
	});

	TextFormatCardView.prototype = Object.create(FormatCardView.prototype);
	Cryptii.TextFormatCardView = TextFormatCardView;


	TextFormatCardView.prototype._init = function(format)
	{
		// call parent init
		FormatCardView.prototype._init.apply(this, arguments);

		// attributes
		this._composerView = null;
	};

	TextFormatCardView.prototype._buildContent = function()
	{
		return FormatCardView.prototype._buildContent.apply(this)
			.append(this.getComposerView().getElement());
	};

	TextFormatCardView.prototype.layout = function()
	{
		// call parent
		FormatCardView.prototype.layout.apply(this, arguments);

		// layout composer view
		this.getComposerView().layout();
	};

	TextFormatCardView.prototype.tick = function()
	{
		// call parent
		FormatCardView.prototype.tick.apply(this, arguments);

		// forward to composer view
		this.getComposerView().tick();
	};

	//
	// event handling
	//

	TextFormatCardView.prototype.onComposerViewChange = function(composerView, content)
	{
		// forward to format
		this._format.onComposerViewChange(composerView, content);
	};

	TextFormatCardView.prototype.onComposerViewSelect = function(composerView, range)
	{
		// forward to format
		this._format.onComposerViewSelect(composerView, range);
	};

	//
	// getters and setters
	//

	TextFormatCardView.prototype.getComposerView = function()
	{
		if (this._composerView === null) {
			this._composerView = new Cryptii.ComposerView(this);
		}

		return this._composerView;
	};

})(Cryptii, jQuery);
