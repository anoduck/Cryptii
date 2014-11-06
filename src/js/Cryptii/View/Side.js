
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	var View = Cryptii.View;
	var SideView = (function() {
		this._init.apply(this, arguments);
	});

	SideView.prototype = Object.create(View.prototype);
	Cryptii.SideView = SideView;


	SideView.prototype._init = function()
	{
		// call parent init
		View.prototype._init.apply(this, arguments);

		// attributes
		this._logoView = null;
		this._hidden = true;

		this._$registeredFormats = null;

		this._delegate = null;
	};


	SideView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

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

	SideView.prototype.updateRegisteredFormats = function(registeredFormats)
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

	SideView.prototype.onFormatSelect = function(Format)
	{
		if (
			this._delegate !== null
			&& this._delegate.onSideFormatSelect !== undefined
		) {
			this._delegate.onSideFormatSelect(Format);
		}
	};

	SideView.prototype.tick = function()
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

	SideView.prototype.setHidden = function(hidden)
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

	SideView.prototype.getLogoView = function()
	{
		if (this._logoView === null) {
			this._logoView = new Cryptii.LogoView();
		}

		return this._logoView;
	};

	SideView.prototype.setDelegate = function(delegate)
	{
		this._delegate = delegate;
	};

})(Cryptii, jQuery);
