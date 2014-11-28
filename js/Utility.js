
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Utility = (function() { this.init.apply(this, arguments); });
	Cryptii.Utility.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Utility = Cryptii.Utility.prototype;
	

	Utility.init = function(start, end)
	{
		// call parent init
		Adam.init.call(this);
	};


	Utility.validateAllowedCharacters = function(content, allowedCharacters)
	{
		// convert to string
		content = content + '';

		if (content.length > 0)
		{
			var isValid = true;
			var i = 0;

			// validate each character
			while (isValid && i < content.length) {
				isValid = (allowedCharacters.indexOf(content[i ++]) !== -1);
			}

			return isValid;
		}

		return false;
	};

})(Cryptii, jQuery);
