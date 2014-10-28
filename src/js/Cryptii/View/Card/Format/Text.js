
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
			this._composerView = new Cryptii.ComposerView(this);
		}

		return this._composerView;
	};

})(Cryptii, jQuery);
