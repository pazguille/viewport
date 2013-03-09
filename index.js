/**
 * Module dependencies.
 */
var Emitter = require('emitter'),
    win = window,
    doc = win.document,
    docEl = doc.documentElement,
    on = win.addEventListener || win.attachEvent,
    RESIZE = (win.attachEvent) ? 'onresize' : 'resize',
    SCROLL = (win.attachEvent) ? 'onscroll' : 'scroll',
    resized = false,
    scrolled = false;

function update() {
    // No changing, exit
    if (!resized && !scrolled) { return; }

    var eve = resized ? 'resize' : 'scroll';

    // Updates viewport
    this.refresh();

    // Change status
    resized = false;
    scrolled = false;

    // Emits the current event
    this.emit(eve);
}

/**
 * Events
 */
on(RESIZE, function () { resized = true; });
on(SCROLL, function () { scrolled = true; });

/**
 * Viewport
 */
function Viewport() {

    // Singleton pattern
    if (!(this instanceof Viewport) && Viewport.getInstance === undefined) {
        return new Viewport();
    }

    if (Viewport.getInstance) {
        return Viewport.getInstance;
    }

    this.init();
}

Emitter(Viewport.prototype);

Viewport.prototype.init = function () {
    var that = this;

    that.refresh();
    that.calculateDeviceDimensions();

    win.setInterval(function () {
        update.call(that);
    }, 350);

    Viewport.getInstance = this;
};

Viewport.prototype.device = {};

Viewport.prototype.calculateDimensions = function () {
    this.height = docEl.clientHeight;
    this.width = docEl.clientWidth;
};

Viewport.prototype.calculateDeviceDimensions = function () {
    this.device.height = win.screen.height;
    this.device.width = win.screen.width;
};

Viewport.prototype.calculateScroll = function () {
    var cachedTop = this.scrollY,
        cachedBottom = this.height + cachedTop,
        bottom;

    this.scrollY = win.pageYOffset || docEl.scrollTop;
    this.scrollX = win.pageXOffset || docEl.scrollLeft;
    bottom = this.height + this.scrollY;

    if (cachedTop !== this.scrollY && this.scrollY === 0) {
        this.emit('top');

    } else if (cachedBottom !== bottom && bottom >= doc.body.scrollHeight) {
        this.emit('bottom');
    }
};

Viewport.prototype.calculateOffset = function () {
    this.top = this.scrollY;
    this.right = this.scrollX + this.width;
    this.bottom = this.scrollY + this.height;
    this.left = this.scrollX;
};

Viewport.prototype.calculateMousePostition = function (eve) {
    // add support for touch events ==> eve.changedTouches;
    var coordX = 0,
        coordY = 0;

    eve = eve || window.event;

    if (eve.pageX || eve.pageY) {
        coordX = eve.pageX;
        coordY = eve.pageY;

    } else {
        coordX = eve.clientX + doc.body.scrollLeft + docEl.scrollLeft;
        coordY = eve.clientY + doc.body.scrollTop + docEl.scrollTop;
    }

    return {
        'posX': coordX,
        'posY': coordY
    };
};

Viewport.prototype.calculateOrientation = function () {
    this.orientation = (Math.abs(win.orientation) === 90) ? 'landscape' : 'portrait';
};

Viewport.prototype.inViewport = function (el) {
    var r = el.getBoundingClientRect();

    return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
};

Viewport.prototype.isVisible = function (el) {
    var r = el.getBoundingClientRect();

    return (r.height >= this.top);
};

Viewport.prototype.refresh = function () {
    this.calculateDimensions();
    this.calculateScroll();
    this.calculateOffset();
    this.calculateOrientation();
};

/**
 * Expose Viewport
 */
exports = module.exports = new Viewport();