
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Directory = (function() { this.init.apply(this, arguments); });
	Cryptii.Directory.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Directory = Cryptii.Directory.prototype;


	Directory.init = function(applicationView)
	{
		// call parent init
		Adam.init.call(this);
		
		// attributes
		this._entries = {};

		this._cardView = null;
	};


	Directory.registerFormat = function(Format, propagate)
	{
		if (propagate === undefined) {
			propagate = true;
		}

		if (Object.prototype.toString.call(Format) !== "[object Array]")
		{
			// retrieve the slug by a format instance
			var instance = new Format();
			var slug = instance.getSlug();

			// add format to directory
			this._entries[slug] = {
				Format: Format,
				name: instance.getName(),
				slug: slug,
				category: instance.getCategory()
			};
		}
		else
		{
			// register each format
			var Formats = Format;
			for (var i = 0; i < Formats.length; i ++)
			{
				this.registerFormat(Formats[i], false);
			}
		}

		if (propagate) {
			// update directory card view
			this.updateCardView();
		}
	};

	Directory.updateCardView = function()
	{
		this.getCardView().buildDirectory(this._entries);
	};

	//
	// delegates
	//

	Directory.onDirectoryCardViewUpdateRequest = function()
	{
		this.updateCardView();
	};

	Directory.onDirectoryCardViewEntryClick = function(directoryCardView, slug)
	{
		this.delegate('onDirectoryFormatSelect', this._entries[slug].Format);
	};

	//
	// accessors
	//

	Directory.getCardView = function()
	{
		if (this._cardView === null)
		{
			this._cardView = new Cryptii.DirectoryCardView();
			this._cardView.addDelegate(this);
		}

		return this._cardView;
	};

})(Cryptii, jQuery);
