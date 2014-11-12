
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.SideView = (function() { this.init.apply(this, arguments); });
	Cryptii.SideView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var SideView = Cryptii.SideView.prototype;


	SideView.init = function()
	{
		// call parent init
		View.init.apply(this, arguments);

		// attributes
		this._logoView = null;
		this._hidden = true;

		this._$registeredFormats = null;
	};


	SideView._build = function()
	{
		// call parent
		var $element = View._build.apply(this);

		// registered formats
		this._$registeredFormats =
			$('<ul></ul>');

		// populate element
		$element
			.attr('id', 'side')
			.append(
				this.getLogoView().getElement(),
				this._$registeredFormats
			);

		if (this._hidden) {
			$element.css('display', 'none');
		}

		return $element;
	};

	SideView.updateRegisteredFormats = function(registeredFormats)
	{
		// ensure that this element
		//  has been built
		this.getElement();

		// clear registered formats
		this._$registeredFormats.empty();

		for (var slug in registeredFormats)
		{
			var registeredFormat = registeredFormats[slug];

			// create format element
			var $format =
				$('<li></li>')
					.append(
						$('<a></a>')
							.attr('href', 'javascript:void(0);')
							.text(registeredFormat.name)
							.click(function() {
								this.sideView.onFormatSelect(this.Format);
							}.bind({
								sideView: this,
								Format: registeredFormat.Format
							}))
					);

			this._$registeredFormats.append($format);
		}
	};

	SideView.tick = function()
	{
		// only handle ticks when visible
		if (!this._hidden)
		{
			// forward tick to logo view
			if (this._logoView !== null) {
				this._logoView.tick();
			}
		}
	};

	SideView.setHidden = function(hidden)
	{
		if (this._hidden != hidden)
		{
			this._hidden = hidden;

			if (hidden)
			{
				// hide element
				this.getElement().hide();
			}
			else
			{
				// show element
				this.getElement().show();
			}
		}
	};

	//
	// delegates
	//

	SideView.onFormatSelect = function(Format)
	{
		this.delegate('onSideViewClose');

		// wait until side is toggled
		//  before propagating the event
		setTimeout(function() {
			this.delegate('onSideViewFormatSelect', Format);
		}.bind(this), 500);
	};

	//
	// accessors
	//

	SideView.getLogoView = function()
	{
		if (this._logoView === null) {
			this._logoView = new Cryptii.LogoView();
		}

		return this._logoView;
	};

})(Cryptii, jQuery);
