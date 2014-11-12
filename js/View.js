
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.View = (function() { this.init.apply(this, arguments); });
	Cryptii.View.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var View = Cryptii.View.prototype;
	

	View.init = function()
	{
		// call parent init
		Adam.init.apply(this, arguments);
		
		// attributes
		this._$element = null;
	};


	View._build = function()
	{
		// create element
		var $element = $('<div></div>');

		return $element;

	};

	View.getElement = function()
	{
		if (this._$element === null)
		{
			this._$element = this._build();
		}

		return this._$element;
	};

	View.forceRepaint = function()
	{
		// using many dom elements can cause missing repaint events
		// http://stackoverflow.com/questions/3485365
		var element = this._$element[0];
		element.style.display = 'none';
		element.offsetHeight;
		element.style.display = '';
	};

})(Cryptii, jQuery);
