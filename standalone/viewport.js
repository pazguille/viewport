(function(e){"use strict";function i(){this.collection={};this.maxListeners=10}var t=e.Object,n=e.Array,r=function(){if(typeof n.isArray==="function"){return n.isArray}return function(e){return t.prototype.toString.call(e)==="[object Array]"}}();i.prototype.addListener=function(e,t,n){if(e===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "addListener(event, listener)": It should receive a listener function.')}var r=this.collection;t.once=n||false;if(r[e]===undefined){r[e]=[]}if(r[e].length+1>this.maxListeners&&this.maxListeners!==0){throw new Error("Warning: So many listeners for an event.")}r[e].push(t);this.emit("newListener");return this};i.prototype.on=i.prototype.addListener;i.prototype.once=function(e,t){this.on(e,t,true);return this};i.prototype.removeListener=function(e,t){if(e===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive an event.')}if(t===undefined){throw new Error('jvent - "removeListener(event, listener)": It should receive a listener function.')}var n=this.collection[e],i=0,s;if(r(n)){s=n.length;for(i;i<s;i+=1){if(n[i]===t){n.splice(i,1);break}}}return this};i.prototype.off=i.prototype.removeListener;i.prototype.removeAllListeners=function(e){if(e===undefined){throw new Error('jvent - "removeAllListeners(event)": It should receive an event.')}delete this.collection[e];return this};i.prototype.setMaxListeners=function(e){if(isNaN(e)){throw new Error('jvent - "setMaxListeners(n)": It should receive a number.')}this.maxListeners=e;return this};i.prototype.listeners=function(e){if(e===undefined){throw new Error('jvent - "listeners(event)": It should receive an event.')}if(this.collection[e]===undefined){throw new Error('jvent - "listeners(event)": The event must exist into the collection.')}return this.collection[e]};i.prototype.emit=function(){var e=arguments,t=e[0],n,i,s;if(t===undefined){throw new Error('jvent - "emit(event)": It should receive an event.')}if(typeof t==="string"){t={type:t}}if(!t.target){t.target=this}if(r(this.collection[t.type])){n=this.collection[t.type];i=0;s=n.length;for(i;i<s;i+=1){n[i].apply(this,arguments);if(n[i].once){this.off(t.type,n[i]);s-=1;i-=1}}}return this};if(typeof e.define==="function"&&e.define.amd!==undefined){e.define("Jvent",[],function(){return i})}else if(typeof module!=="undefined"&&module.exports!==undefined){module.exports=i}else{e.Jvent=e.EventEmitter=i}})(this);
(function (window) {
    'use strict';

    /**
     * Module dependencies.
     */
    var win = window,
        doc = win.document,
        docEl = doc.documentElement,
        on = win.addEventListener || win.attachEvent,
        RESIZE = (win.attachEvent) ? 'onresize' : 'resize',
        SCROLL = (win.attachEvent) ? 'onscroll' : 'scroll',
        resized = false,
        scrolled = false;

    function update() {
        // No changing, exit
        if (!resized && !scrolled) { return; }

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

    Viewport.prototype = new Jvent();

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

        eve = eve || window.event;

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
    };

    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top > 0) && (r.right < this.width)
            && (r.bottom < this.height) && (r.left > 0);
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