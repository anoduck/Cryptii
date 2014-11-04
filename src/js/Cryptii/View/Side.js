
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
	};


	SideView.prototype._build = function()
	{
		// call parent
		var $element = View.prototype._build.apply(this);

		// populate element
		$element
			.attr('id', 'side')
			.css('display', 'none')
			.text('Hello World');

		return $element;
	};

})(Cryptii, jQuery);
