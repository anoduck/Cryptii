
// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.DirectoryCardView = (function() { this.init.apply(this, arguments); });
	Cryptii.DirectoryCardView.prototype = Object.create(Cryptii.CardView.prototype);

	var CardView = Cryptii.CardView.prototype;
	var DirectoryCardView = Cryptii.DirectoryCardView.prototype;


	DirectoryCardView.init = function(format)
	{
		// call parent init
		CardView.init.call(this);

		// elements
		this._$directory = null;
	};


	DirectoryCardView._buildHeader = function()
	{
		return CardView._buildHeader.apply(this)
			.append(
				$('<h2></h2>')
					.text('Directory')
			);
	};

	DirectoryCardView._buildContent = function()
	{
		var $content = CardView._buildContent.apply(this);

		this._$directory =
			$('<div></div>')
				.addClass('directory');

		$content.append(this._$directory);

		return $content;
	};

	DirectoryCardView._buildFooter = function()
	{
		return null;
	};

	DirectoryCardView.buildDirectory = function(entries)
	{
		// only update content if element exists
		if (this._$element !== null)
		{
			var categoryElements = {};

			// clear directory
			this._$directory.empty();

			for (var slug in entries)
			{
				var entry = entries[slug];

				// create category if it does not exist yet
				if (categoryElements[entry.category] === undefined)
				{
					var $category =
						$('<ul></ul>');

					this._$directory.append(
						$('<h3></h3>').text(entry.category),
						$category
					);

					categoryElements[entry.category] = $category;
				}

				// create format element
				var $format =
					$('<li></li>')
						.append(
							$('<a></a>')
								.text(entry.name)
								.attr('href', 'javascript:void(0);')
								.click(function() {
									this.directoryCardView.onEntryClick(this.slug);
								}.bind({
									directoryCardView: this,
									slug: slug
								}))
						);

				// append format to category
				categoryElements[entry.category].append($format);
			}
		}
	};

	DirectoryCardView.onBuild = function()
	{
		// request delegate to update
		this.delegate('onDirectoryCardViewUpdateRequest');
	};

	DirectoryCardView.onEntryClick = function(slug)
	{
		this.delegate('onDirectoryCardViewEntryClick', slug);
	};

})(Cryptii, jQuery);
