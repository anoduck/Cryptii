
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Adam = Cryptii.Adam;
	var Difference = (function() {
		this._init.apply(this, arguments);
	});

	Difference.prototype = Object.create(Adam.prototype);
	Cryptii.Difference = Difference;
	

	Difference.prototype._init = function(startOffset, endOffset, blocks)
	{
		// call parent init
		Adam.prototype._init.apply(this, arguments);

		// attributes
		this._startOffset = startOffset;
		this._endOffset = endOffset;
		this._blocks = blocks;
	};

	Difference.prototype.getStartOffset = function()
	{
		return this._startOffset;
	};

	Difference.prototype.getEndOffset = function()
	{
		return this._endOffset;
	};

	Difference.prototype.getBlocks = function()
	{
		return this._blocks;
	};

})(Cryptii, jQuery);
