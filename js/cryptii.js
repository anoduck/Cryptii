
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
		// application view
		this._applicationView = new Cryptii.ApplicationView();
		this._applicationView.setDelegate(this);

		// conversation view
		this._conversation = new Cryptii.Conversation(this._applicationView);

		// register formats
		this._conversation.registerFormat([
			Cryptii.TextFormat,
			Cryptii.DecimalFormat,
			Cryptii.BinaryFormat,
			Cryptii.HexadecimalFormat,
			Cryptii.OctalFormat
		]);

		// default blocks
		this._conversation.setBlocks([
			84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114,
			111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112,
			115, 32, 111, 118, 101, 114, 32, 49, 51, 32, 108, 97,
			122, 121, 32, 100, 111, 103, 115, 46
		]);

		// attributes
		this._tickTimer = null;

		// add introduction card
		this._applicationView.getDeckView().addCardView(
			new Cryptii.IntroductionCardView());

		// finalize initialization
		this._conversation.updateLocation();
		this._applicationView.focus();
		this._setTickTimerEnabled(true);

		// is page visibility api available
		if (document.hidden !== undefined)
		{
			// bind to change event
			document.addEventListener(
				'visibilitychange',
				this.onVisibilityChange.bind(this));
		}

		// add example cards
		this._conversation.addFormat(new Cryptii.TextFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.BinaryFormat());
		this._conversation.addFormat(new Cryptii.HexadecimalFormat());
		this._conversation.addFormat(new Cryptii.OctalFormat());
	};


	Application.prototype.tick = function()
	{
		// forward tick to application view
		this._applicationView.tick();
	};
	
	Application.prototype._setTickTimerEnabled = function(enabled)
	{
		if ((this._tickTimer !== null) !== enabled)
		{
			if (enabled)
			{
				// enable timer
				this._tickTimer = setInterval(
					this.tick.bind(this), 1000);
			}
			else
			{
				// disable timer
				clearInterval(this._tickTimer);
				this._tickTimer = null;
			}
		}
	};

	Application.prototype.onVisibilityChange = function()
	{
		// disable tick timer based on document visibility
		//  for performance reasons
		this._setTickTimerEnabled(!document.hidden);
	};

	Application.prototype.onApplicationSideFormatSelect = function(Format)
	{
		this._conversation.addFormat(new Format());
		this._applicationView.toggleSide();
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
	

	Conversation.prototype._init = function(applicationView)
	{
		// attributes
		this._applicationView = applicationView;

		this._registeredFormats = [];
		this._formats = [];

		this._blocks = [];
		this._difference = [];

		this._location = new Cryptii.Location();
		this._location.setDelegate(this);
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
			format.convert(this._blocks, this.calculateDifference());

			// add card of format to the deck
			this._applicationView.getDeckView().addCardView(format.getCardView());
		}
	};

	Conversation.prototype.registerFormat = function(Format, updateView)
	{
		if (updateView === undefined) {
			updateView = true;
		}

		if (Object.prototype.toString.call(Format) !== "[object Array]")
		{
			// retrieve the slug by a format instance
			var instance = new Format();
			var slug = instance.getSlug();
			this._registeredFormats[slug] = {
				Format: Format,
				name: instance.getName()
			};
		}
		else
		{
			// register each format
			var Formats = Format;
			for (var i = 0; i < Formats.length; i ++)
			{
				this.registerFormat(Formats[i], false);
			}
		}

		// update registered formats in side view
		if (updateView) {
			var sideView = this._applicationView.getSideView();
			sideView.updateRegisteredFormats(this._registeredFormats);
		}
	};

	Conversation.prototype.getBlocks = function()
	{
		return this._blocks;
	}

	Conversation.prototype.setBlocks = function(blocks, triggeredByFormat)
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

	Conversation.prototype.calculateDifference = function(blocks, previousBlocks)
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

	Conversation.prototype.updateLocation = function()
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
	// event handling
	//

	Conversation.prototype.onFormatContentChange = function(format, blocks)
	{
		this.setBlocks(blocks, format);
	};

	Conversation.prototype.onFormatOptionChange = function(format)
	{
		this.updateLocation();
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

	Format.prototype._createCardView = function()
	{
		// override this method
		return null;
	};
	

	Format.prototype.getName = function()
	{
		// override this method
		return 'Untitled';
	};

	Format.prototype.getSlug = function()
	{
		// creates a slug version of the title
		var slug = this.getName();
		slug = slug.toLowerCase();
		slug = slug.replace(/ /g,'-');

		var specialCharacters = {
			'ä': 'a', 'à': 'a', 'á': 'a',
			'ë': 'e', 'è': 'e', 'é': 'e',
			'ü': 'u', 'ù': 'u', 'ú': 'u',
			'ö': 'o', 'ò': 'o', 'ó': 'o'
		};

		for (var character in specialCharacters) {
			slug = slug.replace(
				new RegExp(character, 'g'),
				specialCharacters[character]);
		}

		return slug;
	};

	Format.prototype.interpret = function(content)
	{
		// override this method
		return [];
	};

	Format.prototype.convert = function(blocks, difference)
	{
		// override this method
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

	Format.prototype.onOptionChange = function(option, value)
	{
		// convert every block
		this.convert(
			this._conversion.getBlocks(),
			this._conversion.calculateDifference());

		// forward event to conversation
		this._conversion.onFormatOptionChange(this);
	};

	Format.prototype.onCardViewClose = function()
	{
		// forward event to conversation
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
		if (this._cardView === null)
		{
			this._cardView = this._createCardView();
		}

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

	Format.prototype.getOptions = function()
	{
		return this._options;
	};

	Format.prototype.registerOption = function(name, option)
	{
		this._options[name] = option;
		option.setDelegate(this);
	};

})(Cryptii, jQuery);

;


var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Location = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Location = Location;
	

	Location.prototype._init = function()
	{
		// attributes
		this._delegate = null;
	};


	Location.prototype._useHashFallback = function()
	{
		// use hash fallback if history is not available
		//  or if this app gets used locally
		return location.hostname == '' || window.history === undefined;
	};

	Location.prototype.setUrl = function(url)
	{
		if (!this._useHashFallback())
		{
			history.replaceState({}, null, url);
		}
		else
		{
			location.href = '#!' + url;
		}
	};

	Location.prototype.getUrl = function(url)
	{
		if (!this._useHashFallback())
		{

		}
		else
		{
			
		}
	};

	Location.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
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
	

	Option.prototype._init = function(label, defaultValue)
	{
		// attributes
		this._delegate = null;

		this._optionView = null;

		this._label = label;

		this._defaultValue = defaultValue;
		this._value = defaultValue;
	};

	Option.prototype._createOptionView = function()
	{
		return new Cryptii.TextOptionView(this);
	};


	Option.prototype.getLabel = function()
	{
		return this._label;
	};

	Option.prototype.isValueValid = function(value)
	{
		// in the base option, every value is valid
		return true;
	};

	Option.prototype.getValue = function()
	{
		return this._value;
	};

	Option.prototype.getEscapedValue = function()
	{
		// escapes every special character except !*()'
		return encodeURIComponent(this.getValue()).replace(/~/g, '%7e');
	};

	Option.prototype.isDefaultValue = function()
	{
		return (this._value == this._defaultValue);
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
		if (this._optionView === null)
		{
			this._optionView = this._createOptionView();
		}

		return this._optionView;
	};

	Option.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
	};

	//
	// event handling
	//

	Option.prototype.onOptionViewChange = function(optionView, value)
	{
		this._value = value;

		if (
			this._delegate !== null
			&& this._delegate.onOptionChange !== undefined
		) {
			this._delegate.onOptionChange(this, value);
		}
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
		this._blockMeta = [];
	};

	TextFormat.prototype._createCardView = function()
	{
		// choose card view for this format
		return new Cryptii.TextFormatCardView(this);
	};


	TextFormat.prototype.getName = function()
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

	TextFormat.prototype.convert = function(blocks, difference)
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

		// options
		this.registerOption('separator', new Cryptii.Option('Separator', ' '));
	};


	DecimalFormat.prototype.getName = function()
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


	BinaryFormat.prototype.getName = function()
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


	HexadecimalFormat.prototype.getName = function()
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


	OctalFormat.prototype.getName = function()
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

		this._sideVisible = false;

		this._delegate = null;

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

	ApplicationView.prototype.toggleSide = function()
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

	ApplicationView.prototype.tick = function()
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

	ApplicationView.prototype.focus = function()
	{
		// focus deck view
		this.getDeckView().focus();
	};


	ApplicationView.prototype.onSideFormatSelect = function(Format)
	{
		if (
			this._delegate !== null
			&& this._delegate.onApplicationSideFormatSelect !== undefined
		) {
			this._delegate.onApplicationSideFormatSelect(Format);
		}
	};


	ApplicationView.prototype.getSideView = function()
	{
		if (this._sideView === null) {
			this._sideView = new Cryptii.SideView();
			this._sideView.setDelegate(this);
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

	ApplicationView.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
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
			this._deckView.removeCardView(this);
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
	// event handling
	//

	CardView.prototype.onClose = function()
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


	ComposerView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._delegate = null;

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
			this.focus();
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
			if (
				this._delegate !== null
				&& this._delegate.onComposerViewChange !== undefined
			) {
				this._delegate.onComposerViewChange(this, content);
			}

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
			if (
				this._delegate !== null
				&& this._delegate.onComposerViewSelect !== undefined
			) {
				this._delegate.onComposerViewSelect(this, selection);
			}
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

	ComposerView.prototype.focus = function()
	{
		this.getElement();
		this._$textarea.focus();
	};

	ComposerView.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
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
							update: this.onSortableUpdate.bind(this)
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

			// reorder
			this._mirrorCardViewOrder();

			// layout
			this.layout();
		}
	};

	DeckView.prototype._mirrorCardViewOrder = function()
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

	DeckView.prototype._findCardViewByElement = function($cardView)
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

	DeckView.prototype.onSortableUpdate = function(event, ui)
	{
		this._mirrorCardViewOrder();
		this.layout();
	};

})(Cryptii, jQuery);

;


// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var LogoView = (function() {
		this._init.apply(this, arguments);
	});

	LogoView.prototype = Object.create(View.prototype);
	Cryptii.LogoView = LogoView;


	LogoView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._$canvas = null;

		// pixel data
		this._content =
			'XXX XX  X X XX XXX X X'
		  + 'X   XX  XXX XX  X  X X'
		  + 'XXX X X  X  X   X  X X';

		// pixel dimensions
		this._contentWidth = 22;
		this._contentHeight = 3;

		this._pixelSize = 5;

		// glitch probability per second
		this._glitchProbability = 0.1;
	};


	LogoView.prototype._build = function()
	{
		// call parent
		var $element =
			$('<h1></h1>');

		// create canvas
		this._$canvas =
			$('<canvas></canvas>')
				.attr('width', this._contentWidth * this._pixelSize)
				.attr('height', this._contentHeight * this._pixelSize);

		// initial draw
		this.draw(false);

		// populate element
		$element.append(this._$canvas);

		return $element;
	};

	LogoView.prototype.draw = function(glitched)
	{
		var context = this._$canvas.get(0).getContext("2d");
		var noiseDensity = (glitched ? 0.1 + Math.random() * 0.3 : 0);

		// go through each pixel in matrix
		for (var i = 0; i < this._contentHeight * this._contentWidth; i ++)
		{
			var isWhite = (this._content[i] == 'X');

			// make noise
			if (
				noiseDensity != 0
				&& Math.random() > noiseDensity
			) {
				isWhite = (Math.random() > 0.5);
			}

			// choose color
			context.fillStyle = (isWhite ? '#aeaeae' : '#191918');

			// draw pixel
			context.fillRect(
				(i % this._contentWidth) * this._pixelSize,
				Math.floor(i / this._contentWidth) * this._pixelSize,
				this._pixelSize,
				this._pixelSize
			);
		}
	};

	LogoView.prototype.animateGlitch = function()
	{
		// draw glitched matrix
		this.draw(true);

		// wait 100ms
		setTimeout(function()
		{
			// draw another glitched matrix
			this.draw(true);

			// wait 100ms
			setTimeout(function()
			{
				// draw correct matrix
				this.draw(false);

			}.bind(this), 100);

		}.bind(this), 100);
	};

	LogoView.prototype.tick = function()
	{
		if (Math.random() < this._glitchProbability) {
			this.animateGlitch();
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
		this._lastKnownValue = option.getValue();
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

	OptionView.prototype.getValue = function()
	{
		// override this method
		return null;
	};

	OptionView.prototype._applyValue = function(value)
	{
		// override this method
	};

	OptionView.prototype.setValue = function(value)
	{
		this._lastKnownValue = value;
		this._applyValue(value);
	};

	OptionView.prototype.tick = function()
	{
		this._trackChanges();
	};

	OptionView.prototype._trackChanges = function()
	{
		var value = this.getValue();

		// check if the value has been changed
		if (value != this._lastKnownValue)
		{
			this._lastKnownValue = value;

			if (this._option.isValueValid(value))
			{
				this._option.onOptionViewChange(this, value);
			}
		}
	};

})(Cryptii, jQuery);

;


// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var SideView = (function() {
		this._init.apply(this, arguments);
	});

	SideView.prototype = Object.create(View.prototype);
	Cryptii.SideView = SideView;


	SideView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._logoView = null;
		this._hidden = true;

		this._$registeredFormats = null;

		this._delegate = null;
	};


	SideView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// registered formats
		this._$registeredFormats =
			$('<ul></ul>');

		// populate element
		$element
			.attr('id', 'side')
			.append(
				this.getLogoView().getElement(),
				this._$registeredFormats
			);

		if (this._hidden) {
			$element.css('display', 'none');
		}

		return $element;
	};

	SideView.prototype.updateRegisteredFormats = function(registeredFormats)
	{
		// ensure that this element
		//  has been built
		this.getElement();

		// clear registered formats
		this._$registeredFormats.empty();

		for (var slug in registeredFormats)
		{
			var registeredFormat = registeredFormats[slug];

			// create format element
			var $format =
				$('<li></li>')
					.append(
						$('<a></a>')
							.attr('href', 'javascript:void(0);')
							.text(registeredFormat.name)
							.click(function() {
								this.sideView.onFormatSelect(this.Format);
							}.bind({
								sideView: this,
								Format: registeredFormat.Format
							}))
					);

			this._$registeredFormats.append($format);
		}
	};

	SideView.prototype.onFormatSelect = function(Format)
	{
		if (
			this._delegate !== null
			&& this._delegate.onSideFormatSelect !== undefined
		) {
			this._delegate.onSideFormatSelect(Format);
		}
	};

	SideView.prototype.tick = function()
	{
		// only handle ticks when visible
		if (!this._hidden)
		{
			// forward tick to logo view
			if (this._logoView !== null) {
				this._logoView.tick();
			}
		}
	};

	SideView.prototype.setHidden = function(hidden)
	{
		if (this._hidden != hidden)
		{
			this._hidden = hidden;

			if (hidden)
			{
				// hide element
				this.getElement().hide();
			}
			else
			{
				// show element
				this.getElement().show();
			}
		}
	};

	SideView.prototype.getLogoView = function()
	{
		if (this._logoView === null) {
			this._logoView = new Cryptii.LogoView();
		}

		return this._logoView;
	};

	SideView.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
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

		// collect option views
		this._optionViews = [];
		var options = format.getOptions();
		for (var name in options)
		{
			var optionView = options[name].getOptionView();
			this._optionViews.push(optionView);
		}
	};


	FormatCardView.prototype._buildHeader = function()
	{
		return CardView.prototype._buildHeader.apply(this)
			.append(
				$('<h3></h3>')
					.addClass('format')
					.text(this._format.getName())
			);
	};

	FormatCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

		// handle format options
		if (this._optionViews.length > 0)
		{
			var $options =
				$('<div></div>')
					.addClass('options');

			// append option views to container
			for (var i = 0; i < this._optionViews.length; i ++) {
				$options.append(this._optionViews[i].getElement());
			}

			// append options
			$content.append($options);
		}

		return $content;
	};

	FormatCardView.prototype._buildFooter = function()
	{
		return null;
	};

	FormatCardView.prototype.layout = function()
	{

	};

	FormatCardView.prototype.tick = function()
	{
		// forward tick to embedded option views
		for (var i = 0; i < this._optionViews.length; i ++)
		{
			this._optionViews[i].tick();
		}
	};

	//
	// event handling
	//

	FormatCardView.prototype.onClose = function()
	{
		// forward to format
		this._format.onCardViewClose(this);
	};

})(Cryptii, jQuery);

;


// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	var CardView = Cryptii.CardView;
	var IntroductionCardView = (function() {
		this._init.apply(this, arguments);
	});

	IntroductionCardView.prototype = Object.create(CardView.prototype);
	Cryptii.IntroductionCardView = IntroductionCardView;


	IntroductionCardView.prototype._build = function()
	{
		return CardView.prototype._build.apply(this)
			.addClass('card-transparent');
	};

	IntroductionCardView.prototype._buildHeader = function()
	{
		return null;
	};

	IntroductionCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

		$content
			.addClass('content-padding')
			.append(
				$('<p></p>')
					.text('Welcome to Cryptii, an OpenSource web app where you can encrypt and decrypt content between different codes and formats with no server connection involved. Find additional formats and information by clicking on the hamburger icon on the left.')
			);

		return $content;
	};

	IntroductionCardView.prototype._buildFooter = function()
	{
		return null;
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


	TextOptionView.prototype._init = function(option)
	{
		// call parent init
		OptionView.prototype._init.apply(this, arguments);

		// attributes
		this._$input = null;
	};


	TextOptionView.prototype._buildField = function()
	{
		// call parent
		var $element = OptionView.prototype._buildField.apply(this)
		
		// input element
		this._$input =
			$('<input>')
				.keyup(this._trackChanges.bind(this));

		this._applyValue(this._lastKnownValue);

		$element.append(this._$input);

		return $element;
	};

	TextOptionView.prototype.getValue = function()
	{
		return this._$input.val();
	};

	TextOptionView.prototype._applyValue = function(value)
	{
		this._$input.val(value);
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

	TextFormatCardView.prototype.canFocus = function()
	{
		return true;
	};

	TextFormatCardView.prototype.focus = function()
	{
		// focus composer view
		this.getComposerView().focus();
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
			this._composerView = new Cryptii.ComposerView();
			this._composerView.setDelegate(this);
		}

		return this._composerView;
	};

})(Cryptii, jQuery);
