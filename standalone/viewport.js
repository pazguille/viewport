!function(a){"use strict";function b(){}b.prototype.on=function(a,b){return this._collection=this._collection||{},this._collection[a]=this._collection[a]||[],this._collection[a].push(b),this},b.prototype.once=function(a,b){function c(){d.off(a,c),b.apply(this,arguments)}var d=this;return c.listener=b,this.on(a,c),this},b.prototype.off=function(a,b){var c=this._collection[a],d=0;if(void 0!==c)for(d;d<c.length;d+=1)if(c[d]===b||c[d].listener===b){c.splice(d,1);break}return 0===c.length&&this.removeAllListeners(a),this},b.prototype.removeAllListeners=function(a){return this._collection=this._collection||{},delete this._collection[a],this},b.prototype.listeners=function(a){return this._collection=this._collection||{},this._collection[a]},b.prototype.emit=function(){if(void 0===this._collection)return this;var a,b=[].slice.call(arguments,0),c=b.shift(),d=this._collection[c],e=0;if(d)for(d=d.slice(0),a=d.length,e;a>e;e+=1)d[e].apply(this,b);return this},"function"==typeof a.define&&void 0!==a.define.amd?a.define("Jvent",[],function(){return b}):"undefined"!=typeof module&&void 0!==module.exports?module.exports=b:a.Jvent=b}(this);
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

        return (r.bottom >= 0 && r.top <= this.height);
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
        window.viewport = new Viewport();
    }
}(this));