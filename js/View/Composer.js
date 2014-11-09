
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

			// delegate
			this.delegate('onComposerViewChange', content);

			// the content size depends on the actual content
			this.layout();
		}

		// check if the selection has been changed
		if (
			(selection === null) != (this._lastKnownSelection === null)
			|| (selection !== null && !selection.isEqualTo(this._lastKnownSelection))
		) {
			this._lastKnownSelection = selection;

			// delegate
			this.delegate('onComposerViewSelect', selection);
		}
	}

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

	//
	// accessors
	//

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

})(Cryptii, jQuery);
