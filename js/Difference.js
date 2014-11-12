
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Difference = (function() { this.init.apply(this, arguments); });
	Cryptii.Difference.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Difference = Cryptii.Difference.prototype;
	

	Difference.init = function(startOffset, endOffset, blocks)
	{
		// call parent init
		Adam.init.apply(this, arguments);

		// attributes
		this._startOffset = startOffset;
		this._endOffset = endOffset;
		this._blocks = blocks;
	};

	Difference.getStartOffset = function()
	{
		return this._startOffset;
	};

	Difference.getEndOffset = function()
	{
		return this._endOffset;
	};

	Difference.getBlocks = function()
	{
		return this._blocks;
	};

})(Cryptii, jQuery);
