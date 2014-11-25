
var Cryptii = Cryptii || {};

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.Range = (function() { this.init.apply(this, arguments); });
	Cryptii.Range.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Range = Cryptii.Range.prototype;
	

	Range.init = function(start, end)
	{
		// call parent init
		Adam.init.call(this);
		
		// attributes
		this._start = start;
		this._end = end;
	};


	Range.isEqualTo = function(range)
	{
		return (
			range != null
			&& range.getStart() == this.getStart()
			&& range.getEnd() == this.getEnd()
		);
	};

	//
	// accessors
	//

	Range.getStart = function()
	{
		return this._start;
	};

	Range.getLength = function()
	{
		return this._end - this._start;
	};

	Range.getEnd = function()
	{
		return this._end;
	};

})(Cryptii, jQuery);
