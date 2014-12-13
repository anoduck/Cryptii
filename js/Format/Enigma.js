
// requires Cryptii.Format

(function(Cryptii, $) {
	'use strict';

	// define class
	Cryptii.EnigmaFormat = (function() { this.init.apply(this, arguments); });
	Cryptii.EnigmaFormat.prototype = Object.create(Cryptii.Format.prototype);

	Cryptii.EnigmaFormat.Rotor = (function() { this.init.apply(this, arguments); });

	var Format = Cryptii.Format.prototype;
	var EnigmaFormat = Cryptii.EnigmaFormat.prototype;
	var Rotor = Cryptii.EnigmaFormat.Rotor.prototype;


	EnigmaFormat.init = function()
	{
		// call parent init
		Format.init.call(this);

		// register rotors
		this._rotors = {
			'I':   new Cryptii.EnigmaFormat.Rotor('I',   'EKMFLGDQVZNTOWYHXUSPAIBRCJ', ['Q']),
			'II':  new Cryptii.EnigmaFormat.Rotor('II',  'AJDKSIRUXBLHWTMCQGZNPYFVOE', ['E']),
			'III': new Cryptii.EnigmaFormat.Rotor('III', 'BDFHJLCPRTXVZNYEIWGAKMUSQO', ['V']),
			'IV':  new Cryptii.EnigmaFormat.Rotor('IV',  'ESOVPZJAYQUIRHXLNFTGKDCMWB', ['J']),
			'V':   new Cryptii.EnigmaFormat.Rotor('V',   'VZBRGITYUPSDNHLXAWMJQOFECK', ['Z'])
		};

		// register entry rotors
		this._entryRotor = new Cryptii.EnigmaFormat.Rotor('ETW', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

		// register reflector rotors
		this._reflectorRotors = {
			'A': new Cryptii.EnigmaFormat.Rotor('UKW A (1930-1937)', 'EJMZALYXVBWFCRQUONTSPIKHGD'),
			'B': new Cryptii.EnigmaFormat.Rotor('UKW B (1937-1945)', 'YRUHQSLDPXNGOKMIEBFZCWVJAT'),
			'C': new Cryptii.EnigmaFormat.Rotor('UKW C (1940-1941)', 'FVPJIAOYEDRZXWGCTKUQSBNMHL')
		};

		// collect reflector rotor choices
		var reflectorChoices = {};
		for (var name in this._reflectorRotors)
		{
			var rotor = this._reflectorRotors[name];
			reflectorChoices[name] = rotor.getLabel();
		}

		// reflector rotor option
		this.registerOption('reflector', new Cryptii.MultipleChoiceOption({
			label: 'Reflector',
			value: 'B',
			optional: false,
			choices: reflectorChoices
		}));

		// collect rotor choices
		var rotorChoices = {};
		for (var name in this._rotors)
		{
			var rotor = this._rotors[name];
			rotorChoices[name] = rotor.getLabel();
		}

		// wheel order option
		this.registerOption('left-rotor', new Cryptii.MultipleChoiceOption({
			label: 'Left rotor',
			value: 'I',
			optional: false,
			choices: rotorChoices
		}));

		this.registerOption('middle-rotor', new Cryptii.MultipleChoiceOption({
			label: 'Middle rotor',
			value: 'II',
			optional: false,
			choices: rotorChoices
		}));

		this.registerOption('right-rotor', new Cryptii.MultipleChoiceOption({
			label: 'Right rotor',
			value: 'III',
			optional: false,
			choices: rotorChoices
		}));

		// collect initial position choices
		var initialPositionChoices = {};
		for (var i = 0; i < 26; i ++)
		{
			var character = String.fromCharCode(i + 65);
			initialPositionChoices[i] = (i + 1) + ' / ' + character;
		}

		// rotor position option
		this.registerOption('left-position', new Cryptii.MultipleChoiceOption({
			label: 'Left position',
			value: 12,
			optional: false,
			choices: initialPositionChoices
		}));

		this.registerOption('middle-position', new Cryptii.MultipleChoiceOption({
			label: 'Middle position',
			value: 2,
			optional: false,
			choices: initialPositionChoices
		}));

		this.registerOption('right-position', new Cryptii.MultipleChoiceOption({
			label: 'Right position',
			value: 10,
			optional: false,
			choices: initialPositionChoices
		}));

	};

	EnigmaFormat._createCardView = function()
	{
		var textFormatCardView = new Cryptii.TextFormatCardView(this);
		textFormatCardView.getComposerView().addDelegate(this);
		return textFormatCardView;
	};
	
	//
	// information
	//

	EnigmaFormat.getName = function()
	{
		return 'Enigma I';
	};

	EnigmaFormat.getSlug = function()
	{
		return 'enigma';
	};

	EnigmaFormat.getCategory = function()
	{
		return 'Cipher';
	};

	EnigmaFormat.isContentReadOnly = function()
	{
		return false;
	};

	EnigmaFormat.isContentTextBased = function()
	{
		return true;
	};

	//
	// convert and interpret
	//

	EnigmaFormat._convert = function(blocks, difference)
	{
		// encrypt
		var encryptedBlocks = this._encrypt(blocks);

		// compose content
		var content = '';

		for (var i = 0; i < encryptedBlocks.length; i ++) {
			content += String.fromCharCode(encryptedBlocks[i]);
		}

		if (this.hasCardView())
		{
			var composerView = this.getCardView().getComposerView();

			// force repaint
			composerView.forceRepaint();

			// update content in card view
			composerView.setContent(content);
		}

		return content;
	};

	EnigmaFormat._interpret = function(content)
	{
		// collect decimal blocks
		var blocks = [];

		for (var i = 0; i < content.length; i ++) {
			blocks.push(content.charCodeAt(i));
		}

		// decrypt
		var decryptedBlocks = this._encrypt(blocks);

		return decryptedBlocks;
	};

	EnigmaFormat._encrypt = function(blocks)
	{
		// wheel order (Walzenlage)
		var leftRotor = this._rotors[this.getOptionValue('left-rotor')];
		var middleRotor = this._rotors[this.getOptionValue('middle-rotor')];
		var rightRotor = this._rotors[this.getOptionValue('right-rotor')];

		// reconfigurable reflector
		var entryRotor = this._entryRotor;
		var reflectorRotor = this._reflectorRotors[this.getOptionValue('reflector')];

		// initial position of the rotors
		leftRotor.setPosition(parseInt(this.getOptionValue('left-position')));
		middleRotor.setPosition(parseInt(this.getOptionValue('middle-position')));
		rightRotor.setPosition(parseInt(this.getOptionValue('right-position')));

		// encrypt
		var encryptedBlocks = [];

		for (var i = 0; i < blocks.length; i ++)
		{
			var decimal = blocks[i];

			// convert the decimal ascii value of
			//  the character to an index (A=0, Z=25)
			var index = null;

			// A-Z
			if (decimal >= 65 && decimal <= 90) {
				index = decimal - 65;
			}

			// a-z
			if (decimal >= 97 && decimal <= 122) {
				index = decimal - 97;
			}

			if (index !== null)
			{
				// handle rotor notches
				if (middleRotor.isAtNotch())
				{
					middleRotor.increment();
					leftRotor.increment();
				}
				else if (rightRotor.isAtNotch())
				{
					middleRotor.increment();
				}

				// the right rotor is incremented
				//  before each character is encoded
				rightRotor.increment();

				// send index through each rotor
				index = entryRotor.map(index, false);

				// forward, from right to left
				index = rightRotor.map(index, false);
				index = middleRotor.map(index, false);
				index = leftRotor.map(index, false);

				// reflected
				index = reflectorRotor.map(index, false);

				// backward, from left to right
				index = leftRotor.map(index, true);
				index = middleRotor.map(index, true);
				index = rightRotor.map(index, true);

				index = entryRotor.map(index, true);

				// convert index back to decimal ascii value
				decimal = index + 65;
			}

			encryptedBlocks.push(decimal);
		}

		return encryptedBlocks;
	};

	//
	// delegates
	//

	EnigmaFormat.onComposerViewChange = function(composerView, content)
	{
		this.setContent(content);
	};

	//
	// rotor
	//

	Rotor.init = function(label, wiring, notches)
	{
		this._label = label;
		this._position = 0;

		// ring setting (Ringstellung)
		// the position of the alphabet ring relative to the rotor wiring
		this._ringSetting = 0;

		// wiring (Walzenverdrahtung)
		this._wiring = wiring;
		this._map = [];
		this._reversedMap = [];

		for (var right = 0; right < wiring.length; right ++)
		{
			var left = wiring[right].charCodeAt(0) - 65;
			this._map[right] = left;
			this._reversedMap[left] = right;
		}

		// notches (Übertragskerben)
		this._notches = [];

		if (notches !== null && notches !== undefined)
		{
			for (var i = 0; i < notches.length; i ++)
			{
				this._notches.push(notches[i].charCodeAt(0) - 65);
			}
		}
	};

	Rotor.getLabel = function()
	{
		return this._label;
	};

	Rotor.map = function(index, reversed)
	{
		var shift = this._position - this._ringSetting;

		// shift by index
		index = (index + shift + 26) % 26;

		// map index through wiring
		if (reversed === false || reversed === undefined) {
			index = this._map[index];
		} else {
			index = this._reversedMap[index];
		}

		// shift back index
		index = (index - shift + 26) % 26;

		return index;
	};

	Rotor.getPosition = function()
	{
		return this._position;
	};

	Rotor.increment = function()
	{
		// increment position
		this.setPosition((this._position + 1) % 26);
	};

	Rotor.setPosition = function(position)
	{
		this._position = position;
	};

	Rotor.isAtNotch = function()
	{
		return (this._notches.indexOf(this._position) !== -1);
	};

})(Cryptii, jQuery);
