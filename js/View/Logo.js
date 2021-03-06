
// requires Cryptii.View

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.LogoView = (function() { this.init.apply(this, arguments); });
	Cryptii.LogoView.prototype = Object.create(Cryptii.View.prototype);

	var View = Cryptii.View.prototype;
	var LogoView = Cryptii.LogoView.prototype;


	LogoView.init = function()
	{
		// call parent init
		View.init.call(this);

		// attributes
		this._$canvas = null;

		// pixel data
		this._content =
			'XXX XX  X X XX XXX X X'
		  + 'X   XX  XXX XX  X  X X'
		  + 'XXX X X  X  X   X  X X';

		// pixel dimensions
		this._contentWidth = 22;
		this._contentHeight = 3;

		this._pixelSize = 5;

		// glitch probability per second
		this._glitchProbability = 0.1;
	};


	LogoView._build = function()
	{
		// call parent
		var $element =
			$('<h1></h1>');

		// create canvas
		this._$canvas =
			$('<canvas></canvas>')
				.attr('width', this._contentWidth * this._pixelSize)
				.attr('height', this._contentHeight * this._pixelSize);

		// initial draw
		this.draw(false);

		// populate element
		$element.append(this._$canvas);

		return $element;
	};

	LogoView.draw = function(glitched)
	{
		var context = this._$canvas.get(0).getContext("2d");
		var noiseDensity = (glitched ? 0.1 + Math.random() * 0.3 : 0);

		// go through each pixel in matrix
		for (var i = 0; i < this._contentHeight * this._contentWidth; i ++)
		{
			var isWhite = (this._content[i] == 'X');

			// make noise
			if (
				noiseDensity != 0
				&& Math.random() > noiseDensity
			) {
				isWhite = (Math.random() > 0.5);
			}

			// choose color
			context.fillStyle = (isWhite ? '#aeaeae' : '#191918');

			// draw pixel
			context.fillRect(
				(i % this._contentWidth) * this._pixelSize,
				Math.floor(i / this._contentWidth) * this._pixelSize,
				this._pixelSize,
				this._pixelSize
			);
		}
	};

	LogoView.animateGlitch = function()
	{
		// draw glitched matrix
		this.draw(true);

		// wait 100ms
		setTimeout(function()
		{
			// draw another glitched matrix
			this.draw(true);

			// wait 100ms
			setTimeout(function()
			{
				// draw correct matrix
				this.draw(false);

			}.bind(this), 100);

		}.bind(this), 100);
	};

	LogoView.tick = function(index)
	{
		if (Math.random() < this._glitchProbability) {
			this.animateGlitch();
		}
	};

})(Cryptii, jQuery);
