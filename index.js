/**
 * Module dependencies.
 */
var Jvent = require('jvent');
var decouple = require('decouple');

/**
 * Scope variables
 */
var win = window;
var doc = win.document;
var docEl = doc.documentElement;

/**
 * Viewport class
 */
function Viewport() {
  this.calculateDeviceDimensions();
  this.refresh();
  decouple(window, 'scroll', this.eventHandler.bind(this));
  decouple(window, 'resize', this.eventHandler.bind(this));
  return this;
}

/**
 * Inherit from an Event Emitter
 */
Viewport.prototype = new Jvent();

/**
 * Event handler for resize and scroll events.
 */
Viewport.prototype.eventHandler = function eventHandler(eve) {
  // // Updates viewport
  this.refresh();
  // // Emits the current event
  this.emit(eve.type);
};

/**
 * Updates the viewport dimension, viewport positions and orientation.
 */
Viewport.prototype.refresh = function refresh() {
  this.calculateDimensions();
  this.calculateScroll();
  this.calculateOffset();
  this.calculateOrientation();
  return this;
};

/**
 * Calculates device size.
 * The size is static and does not change when the page is resized.
 * Returns an object with size of device (`width` and `height`).
 */
Viewport.prototype.calculateDeviceDimensions = function calculateDeviceDimensions() {
  this.device = {};
  this.device.height = win.screen.height;
  this.device.width = win.screen.width;
  this.device.orientation = win.screen.orientation.type;
  return this;
};

/**
 * Calculates/updates the dimensions (`width` and `height`) of viewport (in pixels).
 */
Viewport.prototype.calculateDimensions = function calculateDimensions() {
  this.height = docEl.clientHeight;
  this.width = docEl.clientWidth;
  return this;
};

/**
 * Calculates/updates the scroll positions (`scrollY` and `scrollX`) of viewport.
 */
Viewport.prototype.calculateScroll = function calculateScroll() {
  var cachedTop = this.scrollY;
  var cachedBottom = this.height + cachedTop;
  var bottom;

  this.scrollY = win.pageYOffset;
  this.scrollX = win.pageXOffset;
  bottom = this.height + this.scrollY;

  if (cachedTop !== this.scrollY && this.scrollY === 0) {
    this.emit('top');
  } else if (cachedBottom !== bottom && bottom >= doc.body.scrollHeight) {
    this.emit('bottom');
  }
  return this;
};

/**
 * Calculates/updates the viewport position.
 */
Viewport.prototype.calculateOffset = function calculateOffset() {
  this.top = this.scrollY;
  this.right = this.scrollX + this.width;
  this.bottom = this.scrollY + this.height;
  this.left = this.scrollX;
  return this;
};

/**
 * Calculates/updates the device `orientation`.
 * Returns the device orientation: `portrait-primary`, `portrait-secondary`, `landscape-primary`, `landscape-secondary`.
 */
Viewport.prototype.calculateOrientation = function calculateOrientation() {
  this.device.orientation = win.screen.orientation.type;
  return this;
};

/**
 * Calculate if an element is completely located in the viewport. Returns boolean.
 */
Viewport.prototype.inViewport = function inViewport(el) {
  var r = el.getBoundingClientRect();
  return (r.top >= 0) && (r.right <= this.width)
      && (r.bottom <= this.height) && (r.left >= 0);
};

/**
 * Calculates if an element is visible in the viewport. Returns boolean.
 */
Viewport.prototype.isVisible = function isVisible(el) {
  var r = el.getBoundingClientRect();
  return (r.bottom >= 0 && r.top <= this.height);
};

/**
 * Expose Viewport instance
 */
module.exports = new Viewport();
