
// requires Cryptii.FormatCardView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.TextFormatCardView = (function() { this.init.apply(this, arguments); });
	Cryptii.TextFormatCardView.prototype = Object.create(Cryptii.FormatCardView.prototype);

	var FormatCardView = Cryptii.FormatCardView.prototype;
	var TextFormatCardView = Cryptii.TextFormatCardView.prototype;


	TextFormatCardView.init = function(format)
	{
		// call parent init
		FormatCardView.init.call(this, format);

		// attributes
		this._composerView = null;
	};


	TextFormatCardView._buildContent = function()
	{
		return FormatCardView._buildContent.apply(this)
			.append(this.getComposerView().getElement());
	};

	TextFormatCardView.layout = function()
	{
		// call parent
		FormatCardView.layout.apply(this, arguments);

		// layout composer view
		this.getComposerView().layout();
	};

	TextFormatCardView.canFocus = function()
	{
		return true;
	};

	TextFormatCardView.focus = function()
	{
		// focus composer view
		this.getComposerView().focus();
	};

	TextFormatCardView.tick = function()
	{
		// call parent
		FormatCardView.tick.apply(this, arguments);

		// forward to composer view
		this.getComposerView().tick();
	};

	//
	// accessors
	//

	TextFormatCardView.getComposerView = function()
	{
		if (this._composerView === null) {
			this._composerView = new Cryptii.ComposerView();
		}

		return this._composerView;
	};

})(Cryptii, jQuery);
