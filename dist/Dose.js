(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    var Injector = (function () {
        function Injector() {
        }
        Injector.getRegistered = function (key) {
            var registered = Injector.registery[key];
            if (registered) {
                return registered;
            }
            else {
                throw new Error("Error: " + key + " was not registered.");
            }
        };
        Injector.register = function (key, value) {
            var registered = Injector.registery[key];
            if (registered) {
                console.log("Overriding registered value at " + key + ".");
            }
            else {
                console.log("Registered value at " + key + ".");
            }
            Injector.registery[key] = value;
        };
        Injector.registery = {};
        return Injector;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Injector;
    /* Injection functions */
    function injectMethod() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return function (target, key, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var add = keys.map(function (key) { return Injector.getRegistered(key); });
                args = args.concat(add);
                var result = originalMethod.apply(this, args);
                return result;
            };
            return descriptor;
        };
    }
    function injectProperty() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return function (target, key) {
            target[key] = Injector.getRegistered(keys[0]);
        };
    }
    function inject() {
        var _this = this;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var params = [];
            for (var i = 0; i < args.length; i++) {
                args[i] ? params.push(args[i]) : null;
            }
            switch (params.length) {
                case 2:
                    return injectProperty(keys[0]).apply(_this, args);
                case 3:
                    return injectMethod.apply(void 0, keys).apply(_this, args);
                default:
                    throw new Error("Decorators are not valid here!");
            }
        };
    }
    exports.inject = inject;
});
