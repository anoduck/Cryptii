
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Format = (function() { this.init.apply(this, arguments); });
	Cryptii.Format.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Format = Cryptii.Format.prototype;
	

	Format.init = function()
	{
		// call parent init
		Adam.init.call(this);

		// attributes
		this._cardView = null;
		this._conversation = null;

		// format options
		this._options = {};
	};

	Format._createCardView = function()
	{
		// override this method
		return null;
	};
	

	Format.getName = function()
	{
		// override this method
		return 'Untitled';
	};

	Format.getCategory = function()
	{
		// override this method
		return 'Uncategorized';
	};

	Format.getSlug = function()
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

	Format.interpret = function(content)
	{
		// override this method
		return [];
	};

	Format.convert = function(blocks, difference)
	{
		// override this method
	};

	Format.registerOption = function(name, option)
	{
		this._options[name] = option;
		option.addDelegate(this);
	};

	//
	// delegates
	//

	Format.onOptionChange = function(option, value)
	{
		// convert every block
		this.convert(
			this._conversion.getBlocks(),
			this._conversion.calculateDifference());

		// forward event to conversation
		this._conversion.onFormatOptionChange(this);
	};

	Format.onCardViewClose = function()
	{
		// forward event to conversation
		this._conversion.onFormatRemove(this);
	};

	//
	// accessors
	//

	Format.setConversation = function(conversion)
	{
		this._conversion = conversion;
	};

	Format.getCardView = function()
	{
		if (this._cardView === null)
		{
			this._cardView = this._createCardView();
			this._cardView.addDelegate(this);
		}

		return this._cardView;
	};

	Format.getOptionValue = function(name)
	{
		return this._options[name].getValue();
	};

	Format.getOptions = function()
	{
		return this._options;
	};

	Format.getOptionCount = function()
	{
		var count = 0;
		for (var name in this._options) {
			count ++;
		}

		return count;
	};

	Format.getOptionalOptionCount = function()
	{
		var count = 0;
		for (var name in this._options) {
			if (this._options[name].isOptional()) {
				count ++;
			}
		}

		return count;
	};

	Format.hasOptions = function()
	{
		return (this.getOptionCount() > 0);
	};

})(Cryptii, jQuery);
