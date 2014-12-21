
var Cryptii = Cryptii || {};

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.Adam = (function() { this.init.apply(this, arguments); });
	var Adam = Cryptii.Adam.prototype;
	

	Adam.init = function()
	{
		// attributes
		this._delegates = [];
	};


	Adam.addDelegate = function(delegate)
	{
		if (this._delegates.indexOf(delegate) === -1)
		{
			this._delegates.push(delegate);
		}
	};

	Adam.removeDelegate = function(delegate)
	{
		var index = this._delegates.indexOf(delegate);
		if (index !== -1)
		{
			this._delegates.splice(index, 1);
		}
	};

	Adam.delegate = function(method)
	{
		if (
			method !== undefined
			&& this._delegates.length > 0
		) {
			// add sender as first argument
			var args = [this];

			// collect arguments
			for (var i = 1; i < arguments.length; i ++)
			{
				args.push(arguments[i]);
			}

			// go through delegates
			for (var i = 0; i < this._delegates.length; i ++)
			{
				var delegate = this._delegates[i];

				// check if this delegate supports this method
				if (delegate[method] !== undefined)
				{
					// call delegate method
					delegate[method].apply(delegate, args);
				}
			}
		}
	};

})(Cryptii);
