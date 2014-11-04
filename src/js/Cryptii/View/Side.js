
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
	};


	SideView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// populate element
		$element
			.attr('id', 'side')
			.append(this.getLogoView().getElement());

		if (this._hidden) {
			$element.css('display', 'none');
		}

		return $element;
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

})(Cryptii, jQuery);
