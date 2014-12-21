
var Cryptii = Cryptii || {};

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.Analytics = (function() { this.init.apply(this, arguments); });
	Cryptii.Analytics.prototype = Object.create(Cryptii.Adam.prototype);

	var Adam = Cryptii.Adam.prototype;
	var Analytics = Cryptii.Analytics.prototype;
	var StaticAnalytics = Cryptii.Analytics;


	StaticAnalytics.trackEvent = function(category, label, action, value, userInteraction)
	{
		StaticAnalytics.send({
			'hitType': 'event',
			'eventCategory': category,
			'eventAction': action,
			'eventLabel': label,
			'eventValue': (typeof value === 'number' ? parseInt(value) : undefined),
			'nonInteraction': (userInteraction === false ? 1 : 0)
		});
	};

	StaticAnalytics.send = function(fields)
	{
		if (window.ga !== undefined) {
			window.ga('send', fields);
		}
	};

})(Cryptii);
