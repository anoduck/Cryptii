
// requires Cryptii.DecimalFormat

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.RomanNumeralsFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.RomanNumeralsFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var RomanNumeralsFormat = Cryptii.RomanNumeralsFormat.prototype;


	RomanNumeralsFormat.init = function()
	{
		// call parent init
		DecimalFormat.init.call(this);

		// the morsecode alphabet
		this._romanNumerals = {
			   1: 'I',    4: 'IV',    5: 'V',
			   9: 'IX',  10: 'X',    40: 'XL',
			  50: 'L',   90: 'XC',  100: 'C',
			 400: 'CD', 500: 'D',   900: 'CM',
			1000: 'M'
		};
	};
	
	//
	// information
	//

	RomanNumeralsFormat.getName = function()
	{
		return 'Roman Numerals';
	};

	RomanNumeralsFormat.getSlug = function()
	{
		return 'roman-numerals';
	};
	
	//
	// convert and interpret
	//

	RomanNumeralsFormat.validateDecimal = function(decimal)
	{
		return (decimal > 0 && decimal < 3999);
	};

	RomanNumeralsFormat.convertBlock = function(decimal)
	{
		var result = '';

		do
		{
			// find highest roman numeral that is less
			//  or equal to the decimal
			var highestDecimalValue = 0;
			for (var romanNumeral in this._romanNumerals)
			{
				if (romanNumeral <= decimal) {
					highestDecimalValue = Math.max(highestDecimalValue, romanNumeral);
				}
			}

			// add roman numeral to result
			result += this._romanNumerals[highestDecimalValue];

			// consume decimal
			decimal -= highestDecimalValue;

			// do this until the decimal is
			//  completely consumed
		} while (decimal > 0);

		return result;
	};

	RomanNumeralsFormat.validateContentBlock = function(contentBlock)
	{
		return (contentBlock.length > 0);
	};

	RomanNumeralsFormat.interpretBlock = function(contentBlock)
	{
		var error = false;
		var decimal = 0;
		var previousHighestDecimalValue = 1001;

		do
		{
			// get the largest possible roman numeral from the content head
			var highestDecimalValue = 0;
			for (var decimalValue in this._romanNumerals)
			{
				var romanNumeral = this._romanNumerals[decimalValue];
				if (contentBlock.substr(0, romanNumeral.length) == romanNumeral) {
					highestDecimalValue = Math.max(highestDecimalValue, decimalValue);
				}
			}

			if (
				highestDecimalValue != 0
				&& highestDecimalValue <= previousHighestDecimalValue
			) {
				// add roman numeral digit to result
				decimal += highestDecimalValue;

				// consume roman digit
				contentBlock = contentBlock.substr(
					this._romanNumerals[highestDecimalValue].length);

				// update previous highest roman numeral
				previousHighestDecimalValue = highestDecimalValue;
			}
			else
			{
				// there is a not-recognized letter
				//  or this roman numeral letter is bigger than the last one
				error = true;
			}

			// do this until the roman numeral is
			//  completely converted in decimal
			//  or an error occurs
		} while (contentBlock.length > 0 && !error);

		if (!error) {
			return decimal;
		}

		return null;
	};

})(Cryptii);
