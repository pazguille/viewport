(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.viewport = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"decouple":2,"jvent":3}],2:[function(require,module,exports){
'use strict';

var requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

function decouple(node, event, fn) {
  var eve,
      tracking = false;

  function captureEvent(e) {
    eve = e;
    track();
  }

  function track() {
    if (!tracking) {
      requestAnimFrame(update);
      tracking = true;
    }
  }

  function update() {
    fn.call(node, eve);
    tracking = false;
  }

  node.addEventListener(event, captureEvent, false);

  return captureEvent;
}

/**
 * Expose decouple
 */
module.exports = decouple;

},{}],3:[function(require,module,exports){
'use strict';

function Jvent() {}

/**
 * Adds a listener to the collection for a specified event.
 * @public
 * @function
 * @name Jvent#on
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @example
 * // Will add a event listener to the "ready" event
 * var startDoingStuff = function (event, param1, param2, ...) {
 *   // Some code here!
 * };
 *
 * me.on("ready", startDoingStuff);
 */
Jvent.prototype.on = function(event, listener) {
  this._collection = this._collection || {};
  this._collection[event] = this._collection[event] || [];
  this._collection[event].push(listener);
  return this;
};

/**
 * Adds a one time listener to the collection for a specified event. It will execute only once.
 * @public
 * @function
 * @name Jvent#once
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will add a event handler to the "contentLoad" event once
 * me.once("contentLoad", startDoingStuff);
 */
Jvent.prototype.once = function (event, listener) {
  var that = this;

  function fn() {
    that.off(event, fn);
    listener.apply(this, arguments);
  }

  fn.listener = listener;

  this.on(event, fn);

  return this;
};

/**
 * Removes a listener from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#off
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will remove event handler to the "ready" event
 * var startDoingStuff = function () {
 *   // Some code here!
 * };
 *
 * me.off("ready", startDoingStuff);
 */
Jvent.prototype.off = function (event, listener) {

  var listeners = this._collection && this._collection[event],
      j = 0;

  if (listeners !== undefined) {
    for (j; j < listeners.length; j += 1) {
      if (listeners[j] === listener || listeners[j].listener === listener) {
        listeners.splice(j, 1);
        break;
      }
    }

    if (listeners.length === 0) {
      this.removeAllListeners(event);
    }
  }

  return this;
};

/**
 * Removes all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#removeAllListeners
 * @param {string} event Event name.
 * @returns itself
 * @example
 * me.removeAllListeners("ready");
 */
Jvent.prototype.removeAllListeners = function (event) {
  this._collection = this._collection || {};
  delete this._collection[event];
  return this;
};

/**
 * Returns all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#listeners
 * @param {string} event Event name.
 * @returns Array
 * @example
 * me.listeners("ready");
 */
Jvent.prototype.listeners = function (event) {
  this._collection = this._collection || {};
  return this._collection[event];
};

/**
 * Execute each item in the listener collection in order with the specified data.
 * @name Jvent#emit
 * @public
 * @protected
 * @param {string} event The name of the event you want to emit.
 * @param {...object} var_args Data to pass to the listeners.
 * @example
 * // Will emit the "ready" event with "param1" and "param2" as arguments.
 * me.emit("ready", "param1", "param2");
 */
Jvent.prototype.emit = function () {
  if (this._collection === undefined) {
    return this;
  }

  var args = [].slice.call(arguments, 0), // converted to array
      event = args.shift(),
      listeners = this._collection[event],
      i = 0,
      len;

  if (listeners) {
    listeners = listeners.slice(0);
    len = listeners.length;
    for (i; i < len; i += 1) {
      listeners[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Expose Jvent
 */
module.exports = Jvent;

},{}]},{},[1])(1)
});