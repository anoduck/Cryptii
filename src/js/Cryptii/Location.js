
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var Location = (function() {
		this._init.apply(this, arguments);
	});

	Location.prototype = Object.create(Adam.prototype);
	Cryptii.Location = Location;


	Location.prototype._useHashFallback = function()
	{
		// use hash fallback if history is not available
		//  or if this app gets used locally
		return location.hostname == '' || window.history === undefined;
	};

	Location.prototype.setUrl = function(url)
	{
		if (!this._useHashFallback())
		{
			history.replaceState({}, null, url);
		}
		else
		{
			location.href = '#!' + url;
		}
	};

	Location.prototype.getUrl = function(url)
	{
		if (!this._useHashFallback())
		{

		}
		else
		{
			
		}
	};

})(Cryptii, jQuery);
