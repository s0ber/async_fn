(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AsyncFn"] = factory();
	else
		root["AsyncFn"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $;
	
	$ = __webpack_require__(2).$;
	
	module.exports = window.AsyncFn = (function() {
	  function AsyncFn(asyncFn) {
	    this.dfd = new $.Deferred();
	    this.fn = asyncFn;
	  }
	
	  AsyncFn.prototype.done = function(callback) {
	    this.callback = callback;
	    if (this.isCalled) {
	      return this.callback();
	    }
	  };
	
	  AsyncFn.prototype.call = function() {
	    if (this.isCalled) {
	      return;
	    }
	    return this.fn().always((function(_this) {
	      return function() {
	        _this.isCalled = true;
	        _this.dfd.resolve();
	        if (_this.callback) {
	          return _this.callback();
	        }
	      };
	    })(this));
	  };
	
	  AsyncFn.addToCallQueue = function(fn) {
	    var asyncFn;
	    asyncFn = new AsyncFn(fn);
	    if (this.currentFn != null) {
	      this.currentFn.done(function() {
	        return asyncFn.call();
	      });
	    } else {
	      asyncFn.call();
	    }
	    return this.currentFn = asyncFn;
	  };
	
	  AsyncFn.setImmediate = (function() {
	    var ID, head, onmessage, tail;
	    head = {};
	    tail = head;
	    ID = Math.random();
	    onmessage = function(e) {
	      var func;
	      if (e.data.toString() !== ID.toString()) {
	        return;
	      }
	      head = head.next;
	      func = head.func;
	      delete head.func;
	      return func();
	    };
	    if (window.addEventListener && window.postMessage) {
	      window.addEventListener('message', onmessage, false);
	      return function(func) {
	        tail = tail.next = {
	          func: func
	        };
	        return window.postMessage(ID, '*');
	      };
	    } else {
	      return function(func) {
	        return setTimeout(func, 0);
	      };
	    }
	  })();
	
	  return AsyncFn;
	
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var jquery;
	
	if (true) {
	  module.exports = {
	    $: window.$
	  };
	} else {
	  jquery = require('jquery');
	  module.exports = {
	    $: jquery
	  };
	}


/***/ }
/******/ ])
});
;