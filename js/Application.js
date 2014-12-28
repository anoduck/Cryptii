
var Cryptii = Cryptii || {};

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.Application = (function() { this.init.apply(this, arguments); });
	Cryptii.Application.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Application = Cryptii.Application.prototype;


	Application.init = function()
	{
		// call parent init
		Adam.init.call(this);
		
		// application view
		this._applicationView = new Cryptii.ApplicationView();

		// conversation
		this._conversation = new Cryptii.Conversation(this._applicationView);

		// default blocks
		this._conversation.setDefaultSource([
			84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114,
			111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112,
			115, 32, 111, 118, 101, 114, 32, 49, 51, 32, 108, 97,
			122, 121, 32, 100, 111, 103, 115, 46
		]);

		// directory
		this._directory = new Cryptii.Directory();
		this._directory.addDelegate(this);

		// register formats
		this._directory.registerFormat([
			Cryptii.TextFormat,
			Cryptii.MorsecodeFormat,
			
			Cryptii.DecimalFormat,
			Cryptii.BinaryFormat,
			Cryptii.HexadecimalFormat,
			Cryptii.OctalFormat,
			Cryptii.RomanNumeralsFormat,

			Cryptii.CaesarCipherFormat,
			Cryptii.EnigmaFormat,
			Cryptii.Rot13Format
		]);

		// add directory card
		this._applicationView.getDeckView().addCardView(
			this._directory.getCardView(), false);

		// attributes
		this._tickTimerInterval = 2000;
		this._analyticsPingInterval = 30000;
		this._tickTimer = null;
		this._tickIndex = 0;

		// finalize initialization
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
		this._conversation.addFormat(new Cryptii.TextFormat(), false);
		this._conversation.addFormat(new Cryptii.DecimalFormat(), false);
	};

	
	Application._setTickTimerEnabled = function(enabled)
	{
		if ((this._tickTimer !== null) !== enabled)
		{
			if (enabled)
			{
				// enable timer
				this._tickTimer = setInterval(
					this.tick.bind(this), this._tickTimerInterval);
			}
			else
			{
				// disable timer
				clearInterval(this._tickTimer);
				this._tickTimer = null;
			}
		}
	};

	Application.tick = function()
	{
		// forward tick to application view
		this._applicationView.tick(this._tickIndex);

		// send a ping event to enhance session duration and bounce rate tracking
		if (this._tickIndex % parseInt(this._analyticsPingInterval / this._tickTimerInterval) == 0) {
			Cryptii.Analytics.trackEvent('Application', 'Application', 'ping');
		}

		// increment tick index
		this._tickIndex ++;
	};

	//
	// delegates
	//

	Application.onVisibilityChange = function()
	{
		// disable tick timer based on document visibility
		//  for performance reasons
		this._setTickTimerEnabled(!document.hidden);
	};

	Application.onDirectoryFormatSelect = function(directory, Format)
	{
		// create new instance of format
		var instance = new Format();
		this._conversation.addFormat(instance, true);
	};

})(Cryptii);
