
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var Format = (function() {
		this._init.apply(this, arguments);
	});

	Format.prototype = Object.create(Adam.prototype);
	Cryptii.Format = Format;
	

	Format.prototype._init = function(options)
	{
		// call parent init
		Adam.prototype._init.apply(this, arguments);

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

	Format.prototype.registerOption = function(name, option)
	{
		this._options[name] = option;
		option.addDelegate(this);
	};

	//
	// delegates
	//

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
	// accessors
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
			this._cardView.addDelegate(this);
		}

		return this._cardView;
	};

	Format.prototype.getOptionValue = function(name)
	{
		return this._options[name].getValue();
	};

	Format.prototype.getOptions = function()
	{
		return this._options;
	};

})(Cryptii, jQuery);
