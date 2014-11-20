/*! async_fn (v0.1.6),
 One-method library for calling asynchronous functions one by one in a queue,
 by Sergey Shishkalov <sergeyshishkalov@gmail.com>
 Thu Nov 20 2014 */
(function() {
  var modules;

  modules = {};

  if (window.modula == null) {
    window.modula = {
      "export": function(name, exports) {
        return modules[name] = exports;
      },
      require: function(name) {
        var Module;
        Module = modules[name];
        if (Module) {
          return Module;
        } else {
          throw "Module '" + name + "' not found.";
        }
      }
    };
  }

}).call(this);

(function() {
  window.AsyncFn = (function() {
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
        this.currentFn.done((function(_this) {
          return function() {
            return asyncFn.call();
          };
        })(this));
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

  modula["export"]('async_fn', AsyncFn);

}).call(this);
