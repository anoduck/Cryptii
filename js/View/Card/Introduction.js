
// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.IntroductionCardView = (function() { this.init.apply(this, arguments); });
	Cryptii.IntroductionCardView.prototype = Object.create(Cryptii.CardView.prototype);

	var CardView = Cryptii.CardView.prototype;
	var IntroductionCardView = Cryptii.IntroductionCardView.prototype;


	IntroductionCardView._build = function()
	{
		return CardView._build.apply(this)
			.addClass('card-transparent');
	};

	IntroductionCardView._buildHeader = function()
	{
		return null;
	};

	IntroductionCardView._buildContent = function()
	{
		var $content = CardView._buildContent.apply(this);

		$content
			.addClass('content-padding')
			.append(
				$('<p></p>')
					.text('Welcome to Cryptii, an OpenSource web app where you can encrypt and decrypt content between different codes and formats with no server connection involved. Find additional formats and information by clicking on the hamburger icon on the left.')
			);

		return $content;
	};

	IntroductionCardView._buildFooter = function()
	{
		return null;
	};

})(Cryptii, jQuery);
