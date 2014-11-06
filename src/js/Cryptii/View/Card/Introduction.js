
// requires Cryptii.CardView

(function(Cryptii, $) {
	'use strict';

	// define class
	var CardView = Cryptii.CardView;
	var IntroductionCardView = (function() {
		this._init.apply(this, arguments);
	});

	IntroductionCardView.prototype = Object.create(CardView.prototype);
	Cryptii.IntroductionCardView = IntroductionCardView;


	IntroductionCardView.prototype._build = function()
	{
		return CardView.prototype._build.apply(this)
			.addClass('card-transparent');
	};

	IntroductionCardView.prototype._buildHeader = function()
	{
		return null;
	};

	IntroductionCardView.prototype._buildContent = function()
	{
		var $content = CardView.prototype._buildContent.apply(this);

		$content
			.addClass('content-padding')
			.append(
				$('<p></p>')
					.text('Welcome to Cryptii, an OpenSource web app where you can encrypt and decrypt content between different codes and formats with no server connection involved. Find additional formats and information by clicking on the hamburger icon on the left.')
			);

		return $content;
	};

	IntroductionCardView.prototype._buildFooter = function()
	{
		return null;
	};

})(Cryptii, jQuery);
