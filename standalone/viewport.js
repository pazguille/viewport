(function(e){"use strict";function t(){this.collection={};this.maxListeners=10}t.prototype.addListener=function(e,t,n){if(e===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive a listener function.')}var r=this.collection;t.once=n||false;if(r[e]===undefined){r[e]=[]}if(r[e].length+1>this.maxListeners&&this.maxListeners!==0){throw new Error("Warning: So many listeners for an event.")}r[e].push(t);this.emit("newListener");return this};t.prototype.on=t.prototype.addListener;t.prototype.once=function(e,t){this.on(e,t,true);return this};t.prototype.removeListener=function(e,t){if(e===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive a listener function.')}var n=this.collection[e],r=0,i;if(n!==undefined){i=n.length;for(r;r<i;r+=1){if(n[r]===t){n.splice(r,1);break}}}return this};t.prototype.off=t.prototype.removeListener;t.prototype.removeAllListeners=function(e){if(e===undefined){throw new Error('jvent - "removeAllListeners(event)": It should receive an event.')}delete this.collection[e];return this};t.prototype.setMaxListeners=function(e){if(isNaN(e)){throw new Error('jvent - "setMaxListeners(n)": It should receive a number.')}this.maxListeners=e;return this};t.prototype.listeners=function(e){if(e===undefined){throw new Error('jvent - "listeners(event)": It should receive an event.')}return this.collection[e]};t.prototype.emit=function(){var e=Array.prototype.slice.call(arguments,0),t=e.shift(),n,r=0,i;if(t===undefined){throw new Error('jvent - "emit(event)": It should receive an event.')}if(typeof t==="string"){t={type:t}}if(!t.target){t.target=this}if(this.collection[t.type]!==undefined){n=this.collection[t.type];i=n.length;for(r;r<i;r+=1){n[r].apply(this,e);if(n[r].once){this.off(t.type,n[r]);i-=1;r-=1}}}return this};if(typeof e.define==="function"&&e.define.amd!==undefined){e.define("Jvent",[],function(){return t})}else if(typeof module!=="undefined"&&module.exports!==undefined){module.exports=t}else{e.Jvent=e.EventEmitter=t}})(this);
(function (window) {
    'use strict';

    /**
     * Module dependencies.
     */
    var win = window,
        doc = win.document,
        docEl = doc.documentElement,
        Jvent = win.Jvent,
        on = win.addEventListener || win.attachEvent,
        RESIZE = (on === win.attachEvent) ? 'onresize' : 'resize',
        SCROLL = (on === win.attachEvent) ? 'onscroll' : 'scroll',
        resized = false,
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

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
     * Viewport class
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

        return this;
    }

    Viewport.prototype = new Jvent();

    Viewport.prototype.init = function () {
        var that = this;

        that.refresh();
        that.calculateDeviceDimensions();

        (function updateloop() {
            requestAnimFrame(updateloop);
            update.call(that);
        }());

        Viewport.getInstance = this;

        return this;
    };

    Viewport.prototype.device = {};

    Viewport.prototype.calculateDimensions = function () {
        this.height = docEl.clientHeight;
        this.width = docEl.clientWidth;

        return this;
    };

    Viewport.prototype.calculateDeviceDimensions = function () {
        this.device.height = win.screen.height;
        this.device.width = win.screen.width;

        return this;
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

        return this;
    };

    Viewport.prototype.calculateOffset = function () {
        this.top = this.scrollY;
        this.right = this.scrollX + this.width;
        this.bottom = this.scrollY + this.height;
        this.left = this.scrollX;

        return this;
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
        this.orientation = (Math.abs(win.orientation) === 90)
            ? 'landscape'
            : 'portrait';

        return this;
    };

    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top >= 0) && (r.right <= this.width)
            && (r.bottom <= this.height) && (r.left >= 0);
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

        return this;
    };

    /**
     * Expose Viewport
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('viewport', [], function () {
            return new Viewport();
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = new Viewport();

    // Default
    } else {
        window.Viewport = Viewport;
    }
}(this));