# Viewport Component

The Viewport is a componente to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.

It's cross-broswer compatible:
- Chrome
- Firefox
- Opera
- Safari
- IE9
- IE8
- IE7
- Opera Mobile 12
- Safari Mobile

## Installation

    $ component install pazguille/viewport

## How-to
First, add the following meta viewport:

	<meta name="viewport" content="width=device-width,initial-scale=1.0">

Then, initialize the Viewport:
```js
var Viewport = require('viewport'),
	vp = new Viewport();
```

## API

### Viewport#width
Returns `width` of viewport.

### Viewport#height
Returns `height` of viewport.

### Viewport#calculateDimensions()
Calculates/updates the dimensions values (`width` and `height`).

### Offset
WIP

### Scroll
WIP

### Viewport#orientation
Returns the device orientation: `landscape` or `portrait`.

### Viewport#calculateOrientation()
Calculates/updates the device orientation.

### Mouse Postition
WIP

### Device Dimensions
WIP

### inViewport
WIP

### isVisible
WIP

### Refresh
WIP

### Events
WIP

## Examples

## Contact
- Guille Paz (Frontend developer - JavaScript developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

## License
### The MIT License
Copyright (c) 2012 [@pazguille](http://twitter.com/pazguille)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.