
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
		View.init.call(this);

		// attributes
		this._logoView = null;
		this._hidden = true;
	};


	SideView._build = function()
	{
		// call parent
		var $element = View._build.apply(this);

		// populate element
		$element
			.attr('id', 'side')
			.append(
				this.getLogoView().getElement(),
				$('<ul></ul>')
					.append(
						$('<li></li>')
							.append(
								$('<a></a>')
									.text('GitHub Repository')
									.attr('target', '_blank')
									.attr('href', 'https://github.com/Cryptii/Cryptii')
							)
					)
			);

		if (this._hidden) {
			$element.css('display', 'none');
		}

		return $element;
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
