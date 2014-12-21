
var Cryptii = Cryptii || {};

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.Difference = (function() { this.init.apply(this, arguments); });
	Cryptii.Difference.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Difference = Cryptii.Difference.prototype;
	

	Difference.init = function(blocks, startOffset, endOffset)
	{
		// call parent init
		Adam.init.call(this);

		// attributes
		this._blocks = blocks;
		this._startOffset = startOffset || 0;
		this._endOffset = endOffset || 0;
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

})(Cryptii);
