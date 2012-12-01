# Viewport Component

The Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.

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

See: [https://github.com/component/component](https://github.com/component/component)

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
Returns the current `width` of viewport (in pixels).

### Viewport#height
Returns the current `height` of viewport (in pixels).

### Viewport#calculateDimensions()
Calculates/updates the dimensions (`width` and `height`) of viewport (in pixels).

### Viewport#top
Returns offset `top` of viewport.

### Viewport#right
Returns offset `right` of viewport.

### Viewport#bottom
Returns offset `bottom` of viewport.

### Viewport#left
Returns offset `left` of viewport.

### Viewport#calculateOffset()
Calculates/updates the viewport position.

### Viewport#scrollY
Returns vertical scroll position of viewport.

### Viewport#scrollX
Returns horizontal scroll position of viewport.

### Viewport#calculateScroll()
Calculates/updates the scroll positions (`scrollY` and `scrollX`) of viewport.

### Viewport#orientation
Rertuns the device orientation: `landscape` or `portrait`.

### Viewport#calculateOrientation()
Calculates/updates the device `orientation`.

### Viewport#calculateMousePostition()
Gets the position of the mouse cursor in screen coordinates. Returns an object with the following properties:
- `posY`: y coordinate of the mouse pointer.
- `posX`: x coordinate of the mouse pointer.

### Viewport#device
Device size is static and doesn't change when the page is resized. Returns an object with size of device (`width` and `height`).

### Viewport#inViewport()
Calculate if an element is completely located in the viewport. Returns boolean.

### Viewport#isVisible()
Calculates if an element is visible in the viewport. Returns boolean.

### Viewport#refresh()
Upadtes the viewport dimension, viewport positions and orietation.

### Events
- `scroll`: emited when the viewport are scrolled.
- `resize`: emited when the dimensions of the viewport changes.
- `bottom`: emited when the viewport position is the bottom.
- `top`: emited when the viewport position is the top.

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