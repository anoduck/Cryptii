
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	var Range = (function() {
		this._init.apply(this, arguments);
	});

	Cryptii.Range = Range;
	

	Range.prototype._init = function(start, end)
	{
		// attributes
		this._start = start;
		this._end = end;
	};

	Range.prototype.getStart = function()
	{
		return this._start;
	};

	Range.prototype.getLength = function()
	{
		return this._end - this._start;
	};

	Range.prototype.getEnd = function()
	{
		return this._end;
	};

	Range.prototype.isEqualTo = function(range)
	{
		return (
			range != null
			&& range.getStart() == this.getStart()
			&& range.getEnd() == this.getEnd()
		);
	};

})(Cryptii, jQuery);
