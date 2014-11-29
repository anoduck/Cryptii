
// requires Cryptii.Format

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.TextFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.TextFormat.prototype = Object.create(Cryptii.Format.prototype);

	var Format = Cryptii.Format.prototype;
	var TextFormat = Cryptii.TextFormat.prototype;


	TextFormat.init = function()
	{
		// call parent init
		Format.init.call(this);

		// attributes
		this._blockMeta = [];
	};

	TextFormat._createCardView = function()
	{
		// choose card view for this format
		var textFormatCardView = new Cryptii.TextFormatCardView(this);

		// add delegate
		textFormatCardView.getComposerView().addDelegate(this);

		return textFormatCardView;
	};


	TextFormat.getName = function()
	{
		return 'Text';
	};

	Format.getCategory = function()
	{
		return 'Alphabet';
	};

	TextFormat._getSeparator = function()
	{
		return null;
	};

	TextFormat._getSeparatorLength = function()
	{
		return (this._getSeparator() !== null ? this._getSeparator().length : 0);
	};

	TextFormat.createBlockElement = function(contentBlock, isValid)
	{
		return $(isValid ? '<b></b>' : '<i></i>').text(contentBlock);
	};

	TextFormat.createSeparatorElement = function()
	{
		var separator = this._getSeparator();

		if (separator === null) {
			return null;
		}

		return $('<u>' + separator + '</u>');
	};

	TextFormat.validateContentBlock = function(contentBlock)
	{
		return true;
	};

	TextFormat.interpretBlock = function(contentBlock)
	{
		return contentBlock.charCodeAt(0);
	};

	TextFormat.validateDecimal = function(decimal)
	{
		return true;
	};

	TextFormat.convertBlock = function(decimal)
	{
		return String.fromCharCode(decimal);
	};

	TextFormat.blockRangeByContentRange = function(contentRange)
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

	TextFormat.contentRangeByBlockRange = function(blockRange)
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

	TextFormat.interpret = function(content)
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

			// ignore the blank content block
			//  after the last separator
			if (!(i == contentBlocks.length - 1 && contentBlock == ''))
			{
				// interpret block
				var decimal = null;
				if (this.validateContentBlock(contentBlock)) {
					decimal = this.interpretBlock(contentBlock);
				}

				// create highlighter elements
				var $block = this.createBlockElement(contentBlock, decimal !== null);
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
		}

		this._blockMeta = blockMeta;

		return blocks;
	};

	TextFormat.convert = function(blocks, difference)
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

		// make sure the left content part
		//  ends with a separator
		if (
			leftUnchangedContent.length > 0
			&& separatorLength > 0
			&& leftUnchangedContent.substr(- separatorLength) != separator
		) {
			// append the missing separator
			leftUnchangedContent += separator;
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

			var contentBlock = '?';
			var isValid = false;

			// handle missing decimal and
			//  failing conversion
			if (decimal !== null && this.validateDecimal(decimal))
			{
				var result = this.convertBlock(decimal);
				if (result !== null) {
					contentBlock = result;
					isValid = true;
				}
			}

			// create highlighter elements
			var $block = this.createBlockElement(contentBlock, isValid);
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

		// check if the content ends with a separator
		if (
			content.length > 0
			&& separatorLength > 0
			&& content.substr(- separatorLength) == separator
		) {
			// remove the needless separator
			content = content.substr(0, content.length - separatorLength);
		}

		// force repaint
		composerView.forceRepaint();

		// update content
		composerView.setContent(content);
	};

	TextFormat.getComposerView = function()
	{
		return this.getCardView().getComposerView();
	};

	TextFormat.getHighlighterElement = function()
	{
		return this.getCardView().getComposerView().getHighlighterElement();
	};

	TextFormat.onComposerViewChange = function(composerView, content)
	{
		var time = new Date().getTime();

		// interpret content
		var blocks = this.interpret(content);

		// fire event
		this._conversion.onFormatContentChange(this, blocks);
		
		var delta = new Date().getTime() - time;
		console.log('Time: ' + delta + 'ms');
	};

	TextFormat.onComposerViewSelect = function(composerView, range)
	{

	};

})(Cryptii, jQuery);
