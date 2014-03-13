;(function (global, name, dependencies, factory) {
    // AMD integration
    if (typeof define === 'function' && define.amd) {
        define(name, dependencies, factory);
    }
    // CommonJS integration
    else if (typeof exports === "object" && exports) {
        for (var i = 0, ii = dependencies.length; i < ii; ++i) {
            var dependency = dependencies[i];
            if (typeof dependency === 'string') {
                dependency = dependency.replace(/([A-Z]+)/g, function($1) { return '-'+$1.toLowerCase(); }).replace(/^-/, '');
                dependencies[i] = require(dependency);
            }
        }
        var module = factory.apply(global, dependencies);

        for (var property in module) {
            exports[property] = module[property];
        }
    }
    // Just global variable
    else {
        for (var i = 0, ii = dependencies.length; i < ii; ++i) {
            var dependency = dependencies[i];
            if (typeof dependency === 'string') {
                if (!(dependency in global)) {
                    throw new Error('"' + name + '" dependent on non exited module "' + dependency + '"!');
                }
                dependencies[i] = global[dependency];
            }
        }
        global[name] = factory.apply(global, dependencies);
    }
}((new Function('return this'))(), 'binary-packer', [], function (undefined) {

/**
 * Helper functions
 */
var _ = (function() {
    var _ = {};

    var toString    = Object.prototype.toString;
    var slice       = Array.prototype.slice;

    /**
     * Is a given variable undefined?
     *
     * @param   {*} obj Some object
     * @returns {boolean} true if given variable is undefined
     */
    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    /**
     * Is a given variable object?
     *
     * @param   {*} obj Some object
     * @returns {boolean} true if given variable is object
     */
    _.isObject = function(obj) {
        return obj === Object(obj);
    };

    /**
     * Is a given variable a simple object?
     *
     * @param   {*} obj Some object
     * @returns {boolean} true if given variable is a simple object
     */
    _.isSimpleObject = function(obj) {
        return obj && ({}).constructor === obj.constructor;
    };

    /**
     * Is a given variable is null?
     *
     * @param   {*} obj Some object
     * @returns {boolean} true if given variable is undefined
     */
    _.isNull = function(obj) {
        return obj === null;
    };

    var isFunctions = ['Function', 'String', 'Number', 'Date', 'RegExp', 'Array'];
    for (var i = 0, ii = isFunctions.length; i < ii; ++i) {
        (function(name) {
            _['is' + name] = function(obj) {
                return toString.call(obj) === '[object ' + name + ']';
            }
        })(isFunctions[i]);
    }

    /**
     * Converts array like object to real array
     *
     * @param   {object} obj Array like object
     * @returns {array} Array
     */
    _.toArray = function(obj) {
        return slice.call(obj);
    };

    /**
     * Extend a given object with all the properties in passed-in object(s)
     *
     * @param {object} obj Some object
     * @returns {object} Extended object
     */
    _.extend = function(obj) {
        var sources = slice.call(arguments, 1);

        for (var i = 0, ii = sources.length; i < ii; ++i) {
            var source = sources[i];

            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        }

        return obj;
    };

    /**
     * Create a (shallow-cloned) duplicate of an object
     *
     * @param {object} obj Some object
     * @returns {object} Cloned object
     */
    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    /**
     * Gets last element of array
     *
     * @param   {array} arr Some array
     * @returns {*} Last element of array
     */
    _.last = function(arr) {
        return arr[arr.length - 1];
    };

    /**
     * Checks whether object is empty
     *
     * @param {*} obj Some object
     * @returns {boolean} true if object is empty
     */
    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
        for (var key in obj) if (obj.hasOwnProperty(key)) return false;
        return true;
    };

    /**
     * forEach loop realization
     *
     * @param {object}   obj        Some object
     * @param {function) iterator   Iterator
     * @param {object}   context    Iteration context
     * @returns {boolean} true if object is empty
     */
    _.each = function(obj, iterator, context) {
        if (obj == null) return;

        var native = Array.prototype.forEach;

        if (native && obj.forEach === native) {
            obj.forEach(iterator, context);
        }
        else if (obj.length === +obj.length) {
            for (var i = 0, ii = obj.length; i < ii; ++i) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    };

    return _;
})();


    return {};

}));