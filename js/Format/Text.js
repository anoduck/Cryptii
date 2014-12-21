
// requires Cryptii.Format

(function(Cryptii) {
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
		this._sourceCache = [];
	};

	TextFormat._createCardView = function()
	{
		var textFormatCardView = new Cryptii.TextFormatCardView(this);
		textFormatCardView.getComposerView().addDelegate(this);
		return textFormatCardView;
	};
	
	//
	// information
	//

	TextFormat.getName = function()
	{
		return 'Text';
	};

	TextFormat.getSlug = function()
	{
		return 'text';
	};

	TextFormat.getCategory = function()
	{
		return 'Alphabet';
	};

	TextFormat.isContentReadOnly = function()
	{
		return false;
	};

	TextFormat.isContentTextBased = function()
	{
		return true;
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
	
	//
	// convert
	//

	TextFormat._convert = function(blocks, difference)
	{
		var composerView = null;
		var $highlighter = null;

		if (this.hasCardView())
		{
			composerView = this.getCardView().getComposerView();
			$highlighter = composerView.getHighlighterElement();
		}

		var separator = this._getSeparator();
		var separatorLength = this._getSeparatorLength();

		// determin unchanged content parts
		var leftUnchangedContent = this._content;
		var rightUnchangedContent = this._content;

		// left unchanged content part
		if (difference.getStartOffset() != this._sourceCache.length)
		{
			var contentStartLength = 0;
			for (var i = 0; i < difference.getStartOffset(); i ++) {
				contentStartLength += this._sourceCache[i].content.length + separatorLength;
			}

			leftUnchangedContent = this._content.substr(0, contentStartLength);
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
		if (difference.getEndOffset() != this._sourceCache.length)
		{
			var contentEndIndex = this._content.length;
			for (var i = 0; i < difference.getEndOffset(); i ++) {
				contentEndIndex -= this._sourceCache[this._sourceCache.length - 1 - i].content.length + separatorLength;
			}

			rightUnchangedContent = this._content.substr(contentEndIndex);
		}

		// compose content and update highlighting elements
		var content = leftUnchangedContent;

		// remove blocks in changing range
		for (var i = this._sourceCache.length - difference.getEndOffset() - 1; i >= difference.getStartOffset(); i --)
		{
			// remove highlighter elements from dom
			if (this._sourceCache[i].element !== null) {
				this._sourceCache[i].element.remove();
			}

			if (this._sourceCache[i].separatorElement !== null) {
				this._sourceCache[i].separatorElement.remove();
			}
		
			this._sourceCache.splice(i, 1);
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

			// add content block
			content += contentBlock;

			// add content separator
			if (separator !== null) {
				content += separator;
			}

			var $block = null;
			var $separator = null;

			// create highlighter elements
			if ($highlighter !== null)
			{
				// create highlighter block
				$block = this.createBlockElement(contentBlock, isValid);
				elements.push($block[0]);

				// create highlighter separator
				if (separator !== null) {
					$separator = this.createSeparatorElement();
					elements.push($separator[0]);
				}
			}

			// store source meta
			this._sourceCache.splice(index, 0, {
				content: '' + contentBlock,
				element: $block,
				separatorElement: $separator
			});
		}

		if ($highlighter !== null)
		{
			// append highlighter elements to dom
			if (difference.getStartOffset() > 0)
			{
				// append after element
				var blockBefore = this._sourceCache[difference.getStartOffset() - 1];
				var $before = (blockBefore.separatorElement !== null ? blockBefore.separatorElement : blockBefore.element);
				$before.after(elements)
			}
			else
			{
				// prepent to parent
				$highlighter.prepend(elements);
			}
		}

		// add right unchanged content part
		content += rightUnchangedContent;

		if (composerView !== null)
		{
			// force repaint
			composerView.forceRepaint();

			// update content in card view
			composerView.setContent(content);
		}

		return content;
	};

	TextFormat.validateDecimal = function(decimal)
	{
		return true;
	};

	TextFormat.convertBlock = function(decimal)
	{
		return String.fromCharCode(decimal);
	};
	
	//
	// interpret
	//

	TextFormat._interpret = function(content)
	{
		var $highlighter = null;

		if (this.hasCardView())
		{
			$highlighter =
				this.getCardView().getComposerView().getHighlighterElement();

			// clear highlighter
			$highlighter.empty();
		}

		var separator = this._getSeparator();

		// clear source cache
		this._sourceCache = [];

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

				// validate decimal
				decimal = parseInt(decimal);
				if (isNaN(decimal)) {
					decimal = null;
				}

				var $block = null;
				var $separator = null;

				// create highlighter elements
				if ($highlighter !== null)
				{
					// create highlighter block
					$block = this.createBlockElement(contentBlock, decimal !== null);

					// create highlighter separator
					if (separator !== null) {
						$separator = this.createSeparatorElement();
					}

					// append both to highlighter
					$highlighter.append($block, $separator);
				}

				// store data
				blocks.push(decimal);
				this._sourceCache.push({
					content: '' + contentBlock,
					element: $block,
					separatorElement: $separator
				});
			}
		}

		return blocks;
	};

	TextFormat.validateContentBlock = function(contentBlock)
	{
		return true;
	};

	TextFormat.interpretBlock = function(contentBlock)
	{
		return contentBlock.charCodeAt(0);
	};

	//
	// delegates
	//

	TextFormat.onComposerViewChange = function(composerView, content)
	{
		this.setContent(content);
	};

})(Cryptii);
