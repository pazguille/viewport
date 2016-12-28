/**
 * Module dependencies.
 */
const assert = require('better-assert');
const Jvent = require('jvent');
const jsdom = require('jsdom').jsdom;

/**
 * Create window and document scene
 */
const document = jsdom('<body></body>');
window = document.defaultView;
window.screen = { width: 2000, height: 800, orientation: { type: 'potrait-principal' } };
window.document.documentElement.clientWidth = 1500;
window.document.documentElement.clientHeight = 800;

/**
 * Viewport
 */
const viewport = require('../');

/**
 * Tests
 */
describe('viewport', function () {
  it('should be an instance', function () {
    assert(typeof viewport === 'object');
  });

  it('should inherit from Jvent', function () {
    assert(viewport.constructor === Jvent);
    assert(viewport.on);
    assert(viewport.once);
    assert(viewport.off);
    assert(viewport.emit);
  });

  it('should calculate viewport dimensions', function () {
    assert(viewport.width === 1500);
    assert(viewport.height === 800);
  });

  it('should calculate viewport offset', function () {
    assert(typeof viewport.top === 'number');
    assert(typeof viewport.bottom === 'number');
    assert(typeof viewport.left === 'number');
    assert(typeof viewport.right === 'number');
  });

  it('should calculate device', function () {
    assert(typeof viewport.device === 'object');
  });

  it('should calculate device orientation', function () {
    assert(viewport.device.orientation === 'potrait-principal');
  });

  it('should calculate device dimensions', function () {
    assert(viewport.device.width === 2000);
    assert(viewport.device.height === 800);
  });

  it('should calculate scroll offset', function () {
    assert(typeof viewport.scrollY === 'number');
    assert(typeof viewport.scrollX === 'number');
  });

  it('inViewport true', function () {
    const inViewport = viewport.inViewport({
      getBoundingClientRect() {
        return {
          bottom: 232,
          left: 196,
          right: 800,
          top: 124,
        };
      },
    });
    assert(typeof inViewport === 'boolean');
    assert(inViewport === true);
  });

  it('inViewport false', function () {
    const inViewport = viewport.inViewport({
      getBoundingClientRect() {
        return {
          bottom: 232,
          left: 196,
          right: 800,
          top: -124,
        };
      },
    });
    assert(typeof inViewport === 'boolean');
    assert(inViewport === false);
  });

  it('isVisible true', function () {
    const isVisible = viewport.isVisible({
      getBoundingClientRect() {
        return {
          bottom: 232,
          left: 196,
          right: 800,
          top: 124,
        };
      },
    });
    assert(typeof isVisible === 'boolean');
    assert(isVisible === true);
  });

  it('isVisible false', function () {
    const isVisible = viewport.isVisible({
      getBoundingClientRect() {
        return {
          bottom: 232,
          top: 6000,
        };
      },
    });
    assert(typeof isVisible === 'boolean');
    assert(isVisible === false);
  });
});
