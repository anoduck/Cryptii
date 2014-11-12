
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Location = (function() { this.init.apply(this, arguments); });
	Cryptii.Location.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Location = Cryptii.Location.prototype;


	Location._useHashFallback = function()
	{
		// use hash fallback if history is not available
		//  or if this app gets used locally
		return location.hostname == '' || window.history === undefined;
	};

	Location.setUrl = function(url)
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

	Location.getUrl = function(url)
	{
		if (!this._useHashFallback())
		{

		}
		else
		{
			
		}
	};

})(Cryptii, jQuery);
