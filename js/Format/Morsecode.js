
// requires Cryptii.DecimalFormat

(function(Cryptii) {
	'use strict';

	// define class
	Cryptii.MorsecodeFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.MorsecodeFormat.prototype = Object.create(Cryptii.DecimalFormat.prototype);

	var DecimalFormat = Cryptii.DecimalFormat.prototype;
	var MorsecodeFormat = Cryptii.MorsecodeFormat.prototype;


	MorsecodeFormat.init = function()
	{
		// call parent init
		DecimalFormat.init.call(this);

		// the morsecode alphabet
		this._alphabet = {

			// a-z
			 97: 'SL',       98: 'LSSS',     99: 'LSLS',
			100: 'LSS',     101: 'S',       102: 'SSLS',
			103: 'LLS',     104: 'SSSS',    105: 'SS',
			106: 'SLLL',    107: 'LSL',     108: 'SLSS',
			109: 'LL',      110: 'LS',      111: 'LLL',
			112: 'SLLS',    113: 'LLSL',    114: 'SLS',
			115: 'SSS',     116: 'L',       117: 'SSL',
			118: 'SSSL',    119: 'SLL',     120: 'LSSL',
			121: 'LSLL',    122: 'LLSS',

			// 0-9
			 48: 'LLLLL',    49: 'SLLLL',    50: 'SSLLL',
			 51: 'SSSLL',    52: 'SSSSL',    53: 'SSSSS',
			 54: 'LSSSS',    55: 'LLSSS',    56: 'LLLSS',
			 57: 'LLLLS',

			// special characters
			224: 'SLLSL',   228: 'SLSL',    232: 'SLSSL',
			233: 'SSLSS',   246: 'LLLS',    252: 'SSLL',
			223: 'SSSLLSS',

			// punctuation
			 46: 'SLSLSL',   44: 'LLSSLL',   58: 'LLLSSS',
			 59: 'LSLSLS',   63: 'SSLLSS',   38: 'SLSSS',
			 36: 'SSSLSSL',  45: 'LSSSSL',   95: 'SSLLSL',
			 40: 'LSLLS',    41: 'LSLLSL',   92: 'SLLLLS',
			 34: 'SLSSLS',   61: 'LSSSL',    43: 'SLSLS',
			 47: 'LSSLS',    64: 'SLLSLS',   32: 'E'
		};

		// flip alphabet
		this._flippedAlphabet = null;

		// short character option
		this.registerOption('short', new Cryptii.MultipleChoiceOption({
			label: 'Short',
			value: '.',
			optional: true,
			choices: ['.', '·'],
			labels: ['Baseline dot', 'Middle dot']
		}));

		// long character option
		this.registerOption('long', new Cryptii.MultipleChoiceOption({
			label: 'Long',
			value: '-',
			optional: true,
			choices: ['-', '–', '_'],
			labels: ['Dash', 'En dash', 'Underscore']
		}));

		// space character option
		this.registerOption('space', new Cryptii.MultipleChoiceOption({
			label: 'Space',
			value: '/',
			optional: true,
			choices: ['/', '\\', '|'],
			labels: ['Forward slash', 'Backslash', 'Vertical bar']
		}));
	};

	//
	// information
	//

	MorsecodeFormat.getName = function()
	{
		return 'Morsecode';
	};

	MorsecodeFormat.getSlug = function()
	{
		return 'morsecode';
	};

	MorsecodeFormat.getCategory = function()
	{
		return 'Alphabet';
	};

	//
	// convert and interpret
	//

	MorsecodeFormat.getFlippedAlphabet = function()
	{
		if (this._flippedAlphabet === null)
		{
			this._flippedAlphabet = {};
			for (var key in this._alphabet) {
				this._flippedAlphabet[this._alphabet[key]] = key;
			}
		}

		return this._flippedAlphabet;
	};

	MorsecodeFormat.convertBlock = function(decimal)
	{
		var contentBlock = null;

		// convert decimal to string, lowercase it and convert it back
		decimal = String.fromCharCode(decimal).toLowerCase().charCodeAt(0);

		if (this._alphabet[decimal] !== undefined)
		{
			var pseudoBlock = this._alphabet[decimal];

			// collect the replacement characters
			//  to build the content block
			var replacement = {
				'S': this.getOptionValue('short'),
				'L': this.getOptionValue('long'),
				'E': this.getOptionValue('space')
			};

			var i = 0;

			contentBlock = '';

			while (i < pseudoBlock.length)
			{
				var pseudoCharacter = pseudoBlock[i ++];
				contentBlock += replacement[pseudoCharacter];
			}
		}

		return contentBlock;
	};

	MorsecodeFormat.validateContentBlock = function(contentBlock)
	{
		// content blocks get validated
		//  during the interpret process
		return true;
	};

	MorsecodeFormat.interpretBlock = function(contentBlock)
	{
		// convert to string
		contentBlock = contentBlock + '';

		// collect the replacement characters
		//  to build the alphabet key
		var replacement = {}
		replacement[this.getOptionValue('short')] = 'S';
		replacement[this.getOptionValue('long')] = 'L';
		replacement[this.getOptionValue('space')] = 'E';

		// interpret each symbol of this block
		var isValid = true;
		var i = 0;

		var key = '';

		while (isValid && i < contentBlock.length)
		{
			var character = contentBlock[i ++];
			if (replacement[character] !== undefined) {
				// add character to alphabet key
				key += replacement[character];
			} else {
				// character could not be recognized
				isValid = false;
			}
		}

		// retrieve the decimal value from alphabet
		var decimal = null;

		if (isValid)
		{
			var flippedAlphabet = this.getFlippedAlphabet();
			if (flippedAlphabet[key] !== undefined) {
				decimal = flippedAlphabet[key];
			}
		}

		return decimal;
	};

})(Cryptii);
