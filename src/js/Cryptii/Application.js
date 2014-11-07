
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var Application = (function() {
		this._init.apply(this, arguments);
	});

	Application.prototype = Object.create(Adam.prototype);
	Cryptii.Application = Application;


	Application.prototype._init = function()
	{
		// call parent init
		Adam.prototype._init.apply(this, arguments);
		
		// application view
		this._applicationView = new Cryptii.ApplicationView();

		// conversation view
		this._conversation = new Cryptii.Conversation(this._applicationView);

		// connect to delegates
		this._applicationView.getSideView().addDelegate(this);

		// register formats
		this._conversation.registerFormat([
			Cryptii.TextFormat,
			Cryptii.DecimalFormat,
			Cryptii.BinaryFormat,
			Cryptii.HexadecimalFormat,
			Cryptii.OctalFormat
		]);

		// default blocks
		this._conversation.setBlocks([
			84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114,
			111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112,
			115, 32, 111, 118, 101, 114, 32, 49, 51, 32, 108, 97,
			122, 121, 32, 100, 111, 103, 115, 46
		]);

		// attributes
		this._tickTimer = null;

		// add introduction card
		this._applicationView.getDeckView().addCardView(
			new Cryptii.IntroductionCardView());

		// finalize initialization
		this._conversation.updateLocation();
		this._applicationView.focus();
		this._setTickTimerEnabled(true);

		// is page visibility api available
		if (document.hidden !== undefined)
		{
			// bind to change event
			document.addEventListener(
				'visibilitychange',
				this.onVisibilityChange.bind(this));
		}

		// add example cards
		this._conversation.addFormat(new Cryptii.TextFormat());
		this._conversation.addFormat(new Cryptii.DecimalFormat());
		this._conversation.addFormat(new Cryptii.BinaryFormat());
		this._conversation.addFormat(new Cryptii.HexadecimalFormat());
		this._conversation.addFormat(new Cryptii.OctalFormat());
	};

	
	Application.prototype._setTickTimerEnabled = function(enabled)
	{
		if ((this._tickTimer !== null) !== enabled)
		{
			if (enabled)
			{
				// enable timer
				this._tickTimer = setInterval(
					this.tick.bind(this), 1000);
			}
			else
			{
				// disable timer
				clearInterval(this._tickTimer);
				this._tickTimer = null;
			}
		}
	};

	Application.prototype.tick = function()
	{
		// forward tick to application view
		this._applicationView.tick();
	};

	//
	// delegates
	//

	Application.prototype.onVisibilityChange = function()
	{
		// disable tick timer based on document visibility
		//  for performance reasons
		this._setTickTimerEnabled(!document.hidden);
	};

	Application.prototype.onSideViewFormatSelect = function(sideView, Format)
	{
		this._conversation.addFormat(new Format());
	};

})(Cryptii, jQuery);
