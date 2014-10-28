
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
