
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var View = (function() {
		this._init.apply(this, arguments);
	});

	View.prototype = Object.create(Adam.prototype);
	Cryptii.View = View;
	

	View.prototype._init = function()
	{
		// call parent init
		Adam.prototype._init.apply(this, arguments);
		
		// attributes
		this._$element = null;
	};

	View.prototype._build = function()
	{
		// create element
		var $element = $('<div></div>');

		return $element;

	};

	View.prototype.getElement = function()
	{
		if (this._$element === null)
		{
			this._$element = this._build();
		}

		return this._$element;
	};

	View.prototype.forceRepaint = function()
	{
		// using many dom elements can cause missing repaint events
		// http://stackoverflow.com/questions/3485365
		var element = this._$element[0];
		element.style.display = 'none';
		element.offsetHeight;
		element.style.display = '';
	};

})(Cryptii, jQuery);