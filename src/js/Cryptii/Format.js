
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
	

	Format.prototype.getTitle = function()
	{
		// override this method
		return 'Untitled';
	};

	Format.prototype.getSlug = function()
	{
		// creates a slug version of the title
		var slug = this.getTitle();
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
		option.setFormat(this);
	};

})(Cryptii, jQuery);
