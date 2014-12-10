
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

		// format options
		this._group = 0;
		this._options = {};

		this._source = [];
		this._content = null;

		if (
			!this.isContentReadOnly()
			&& this.isContentTextBased()
		) {
			this._content = '';
		}
	};

	Format._createCardView = function()
	{
		// overwrite this method
		return null;
	};
	
	//
	// information
	//

	Format.getName = function()
	{
		// overwrite this method
		return 'Untitled';
	};

	Format.getSlug = function()
	{
		// overwrite this method
		return 'untitled';
	};

	Format.getCategory = function()
	{
		// overwrite this method
		return 'Uncategorized';
	};

	Format.isContentReadOnly = function()
	{
		// overwrite this method
		return true;
	};

	Format.isContentTextBased = function()
	{
		// overwrite this method
		return false;
	};
	
	//
	// convert and interpret
	//

	Format._convert = function(blocks, difference)
	{
		// converts source blocks to content
		//  and manipulates the card view
		//  (e.g. highlighter)
		
		// the difference parameter describes
		//  which blocks have been changed

		// returns null if the content
		//  is not text based or read only
		return null;
	};

	Format._interpret = function(content)
	{
		// interprets content to source blocks
		return [];
	};
	
	//
	// public interface
	//

	Format.getGroup = function()
	{
		return this._group;
	};

	Format.setGroup = function(group)
	{
		this._group = group;
	};

	Format.setSource = function(blocks, difference)
	{
		// update source
		this._source = blocks;

		// convert
		this._content = this._convert(blocks, difference || new Cryptii.Difference(this._source));

		// delegate change
		this.delegate('onFormatContentChange', this._content);
	};

	Format.refresh = function()
	{
		// create a difference containing the whole block range
		var difference = new Cryptii.Difference(this._source);

		// convert
		this._content = this._convert(this._source, difference);

		// delegate change
		this.delegate('onFormatContentChange', this._content);
	};

	Format.getSource = function()
	{
		return this._source;
	};

	Format.setContent = function(content)
	{
		if (
			!this.isContentReadOnly()
			&& this.isContentTextBased()
		) {
			// update content
			this._content = content;

			// interpret
			this._source = this._interpret(content);

			// delegate change
			this.delegate('onFormatSourceChange', this._source);
		}
	};

	Format.getContent = function()
	{
		// only gets called if isContentTextBased
		//  returns true

		// returns text based content if available
		//  if not available, returns null
		return this._content;
	};

	//
	// delegates
	//

	Format.onOptionChange = function(option, value)
	{
		// overwrite to handle option changes differently
		this.refresh();
	};

	//
	// accessors
	//

	Format.hasCardView = function()
	{
		// returns true if a card view is in use
		return (this._cardView !== null);
	};

	Format.getCardView = function()
	{
		if (!this.hasCardView())
		{
			this._cardView = this._createCardView();
			this._cardView.addDelegate(this);

			// refresh conversion
			this.refresh();
		}

		return this._cardView;
	};

	Format.registerOption = function(name, option)
	{
		this._options[name] = option;
		option.addDelegate(this);
	};

	Format.getOptionValue = function(name)
	{
		return this._options[name].getValue();
	};

	Format.setOptionValue = function(name, value)
	{
		var option = this._options[name];
		var success = false;

		if (option !== undefined) {
			success = option.setValue(value);
		} else {
			console.error(name + ' option does not exist');
		}

		return success;
	};

	Format.hasOptions = function()
	{
		return (this.getOptionCount() > 0);
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

})(Cryptii, jQuery);
