# Cryptii
An OpenSource web application used under the MIT license where you can convert, encrypt and decrypt content between different codes and formats. This happens fully in the browser using JavaScript with no server connection involved.

## Usage
You can include Cryptii as a library in your JavaScript project:

```javascript
var input = "Hello World";

var textFormat = new Cryptii.TextFormat();
textFormat.setContent(input);

console.log(textFormat.getSource());
// logs [72, 101, 108, 108, ...]

var rot13Format = new Cryptii.Rot13Format();
rot13Format.setOptionValue('variant', 'rot47');
rot13Format.setSource(textFormat.getSource());

console.log(rot13Format.getContent());
// logs "w6==@ (@C=5"
```

## Build
This repository does not contain a built version of it. To create your own build, open up the terminal, `cd` into your local repository and follow these steps:

#### 1. Install Node.js and Gulp
Download and install [Node.js](http://nodejs.org/download/).
Install [Gulp](http://gulpjs.com/) globally by running:

    sudo npm install --global gulp

#### 2. Install the development dependencies
External packages are required to create an own build of this project. These dependencies are described inside `package.json`. Install them by typing:

    npm install

#### 3. Build from source
Create a build from the source files:

    gulp build

Watch the source files and create a build on every file change:

    gulp

## License
The MIT License (MIT)

Copyright (c) 2014 Fränz Friederes <[fraenz@frieder.es](mailto:fraenz@frieder.es)>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.