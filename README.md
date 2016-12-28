# Viewport Component

Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.

## Installation

	$ npm install viewportjs

### Standalone
Also, you can use it without components.
```html
<script src="../standalone/viewport.js"></script>
```

## Usage
First, add the following meta viewport:
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```
Then, initialize the Viewport:
```js
var viewport = require('viewport');
```
Now, starts to use it!
```js
viewport.height // Returns the current height of the viewport. (Read below the API)
```

## Browser Support
- Chrome (OS X, Windows)
- Firefox (OS X, Windows)
- Opera (OS X, Windows)
- Safari (OS X, Windows)
- IE10+

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
Returns the device orientation: `portrait-primary`, `portrait-secondary`, `landscape-primary`, `landscape-secondary`.

### Viewport#calculateOrientation()
Calculates/updates the device `orientation`.

### Viewport#device
Device size is static and doesn't change when the page is resized. Returns an object with size of device (`width` and `height`).

### Viewport#inViewport()
Calculate if an element is completely located in the viewport. Returns boolean.

### Viewport#isVisible()
Calculates if an element is visible in the viewport. Returns boolean.

### Viewport#refresh()
Updates the viewport dimension, viewport positions and orientation.

### Events
- `scroll`: emitted when the viewport are scrolled.
- `resize`: emitted when the dimensions of the viewport changes.
- `bottom`: emitted when the viewport position is the bottom.
- `top`: emitted when the viewport position is the top.

## With :heart: by

- Guille Paz (Frontend developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [https://pazguille.me](https://pazguille.me)

## License

MIT license. Copyright © 2016.

[npm-image]: https://img.shields.io/npm/v/horwheel.svg
[lic-image]: https://img.shields.io/npm/l/horwheel.svg
[npm-link]: https://npmjs.org/package/horwheel
[deps-image]: https://img.shields.io/david/pazguille/horwheel.svg
[deps-link]: https://david-dm.org/pazguille/horwheel
[devdeps-image]: https://img.shields.io/david/dev/pazguille/horwheel.svg
[devdeps-link]: https://david-dm.org/pazguille/horwheel#info=devDependencies
[dt-image]: https://img.shields.io/npm/dt/horwheel.svg
