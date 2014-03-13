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

function Packer(dataTypes) {
    this._dataTypes = [];
    this._dataTypesIndex = {};

    Packer.init(this, dataTypes);
}

_.extend(Packer, {

    init: function(that, dataTypes) {
        that.setDataTypes(dataTypes);
    }

});

_.extend(Transport_Packer.prototype, {

    getDataTypes: function() {
        return this._dataTypes;
    },

    setDataTypes: function(dataTypes) {
        this._dataTypes = [];
        return this.addDataTypes(dataTypes);
    },

    addDataTypes: function(dataTypes) {
        for (var i = 0, ii = dataTypes.length; i < ii; ++i) {
            this.addDataType(dataTypes[i]);
        }
        return this;
    },

    addDataType: function(dataType) {
        if (!_.isString(dataType.name)) {
            throw new Error('Data type must have a name!');
        }
        if (!_.isFunction(dataType.condition)) {
            throw new Error('Data type "' + dataType.name + '" must  have a condition logic');
        }
        if (!_.isFunction(dataType.pack)) {
            throw new Error('Data type "' + dataType.name + '" must have a pack method!');
        }
        if (!_.isFunction(dataType.unpack)) {
            throw new Error('Data type "' + dataType.name + '" must have an unpack method!');
        }

        var index = this._dataTypes.push(dataType) - 1;
        this._dataTypesIndex[dataType.name] = index;

        return this;
    },

    getDataType: function(name) {
        if (!this.hasDataType(name)) {
            throw new Error('Data type "' + name + '" does not exists!');
        }

        return this._dataTypes[this._dataTypesIndex[name]]
    },

    hasDataType: function(name) {
        return name in this._dataTypesIndex;
    },

    removeDataType: function(name) {
        if (!this.hasDataType(name)) {
            throw new Error('Data type "' + name + '" does not exists!');
        }

        var index = this._dataTypesIndex[name];
        this._dataTypes.splice(index, 1);
        delete this._dataTypesIndex[name];

        return this;
    },

    findDataTypeForData: function(data) {
        var dataTypes = this._dataTypes;

        for (var i = 0, ii = dataTypes.length; i < ii; ++i) {
            var dataType = dataTypes[i];

            if (dataType.condition.call(this, data)) {
                return dataType;
            }
        }

        throw new Error('Data type does not found for specified data!');

        for (var code in dataTypes) {
            var dataType = dataTypes[code];
            if (dataType.condition.call(this, data)) {

                codeBuffer = new Buffer(1);
                codeBuffer.writeUInt8(code, 0);

                dataBuffer = dataType.pack.call(this, data);

                isFound = true;
                break;
            }
        }
    },

    getDataTypeCode: function(name) {
        if (_.isString(name.name)) {
            name = name.name;
        }

        if (!this.hasDataType(name)) {
            throw new Error('Data type "' + name + '" does not exists!');
        }

        return this._dataTypesIndex[name];
    },

    getDataTypeByCode: function(code) {
        if (!(code in this._dataTypes)) {
            throw new Error('Data type with code "' + code + '" does not exists!');
        }
        return this._dataTypes[code];
    },

    pack: function(data) {
        return this.doPack(data)[0];
    },

    unpack: function(binary) {
        return this.doUnpack(binary)[0];
    },

    doPack: function(data) {

        var dataType = this.findDataTypeForData(data);
        var code     = this.getDataTypeCode(dataType);

        var codeBinary = Binary.create(1).write('UInt8', code);
        var dataBinary = dataType.pack.call(this, data);

        var binary = Binary.concat(codeBinary, dataBinary);

        return [binary, binary.length];
    },

    doUnpack: function(binary) {

        var code     = binary.read('UInt8');
        var dataType = this.getDataTypeByCode(code);

        var data = dataType.unpack.call(this, binary.slice(1));

        return [data[0], data[1]+1];
    }

});


var DataType_Array = {
    name: 'array',
    
    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },

    pack: function(array) {
        var buffers = [];
        for (var i = 0, ii = array.length; i < ii; ++i) {
            buffers.push(this.pack(array[i]));
        }
        buffers.push(new Buffer('\u0000', 'utf8'));
        return Buffer.concat(buffers);
    },

    unpack: function(buffer) {
        var valueData, value, valueLength;

        var length = 0;
        var array  = [];

        while ('\u0000' !== buffer.toString('utf8', length, length+1)) {
            valueData = this.unpack(buffer.slice(length));
            value       = valueData[0];
            valueLength = valueData[1];

            length += valueLength;
            array.push(value);
        }
        length += 1;
        return [array, length];
    }
};

var DataType_Boolean = {
    name: 'boolean',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Boolean]';
    },

    pack: function(boolean) {
        var buffer = new Buffer(1);
        buffer.writeUInt8(boolean ? 1 : 0, 0);
        return buffer;
    },

    unpack: function(buffer) {
        return [!!buffer.readUInt8(0), 1];
    }
};

var DataType_Buffer = {
    name: 'buffer',

    condition: function(value) {
        return value instanceof Buffer;
    },

    pack: function(buffer) {
        var lengthBuffer = new Buffer(4);
        lengthBuffer.writeUInt32LE(buffer.length, 0);
        return Buffer.concat([lengthBuffer, buffer]);
    },

    unpack: function(buffer) {
        var length = buffer.readUInt32LE(0);
        return [buffer.slice(4, 4+length), 4+length];
    }
};

var DataType_Null = {
    name: 'null',

    condition: function(value) {
        return value === null;
    },

    pack: function() {
        return new Buffer([]);
    },

    unpack: function() {
        return [null, 0];
    }
};

var DataType_Number = {
    name: 'number',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Number]';
    },

    pack: function(number) {
        var buffer = new Buffer(8);
        buffer.writeDoubleLE(number, 0);
        return buffer;
    },

    unpack: function(buffer) {
        return [buffer.readDoubleLE(0), 8]
    }
};

var DataType_SimpleObject = {
    name: 'simple_object',

    condition: function(value) {
        return ({}).constructor === value.constructor;
    },

    pack: function(object) {
        var buffers = [];
        for (var param in object) {
            buffers.push(this.pack(param));
            buffers.push(this.pack(object[param]));
        }
        buffers.push(new Buffer('\u0000', 'utf8'));
        return Buffer.concat(buffers);
    },

    unpack: function(buffer) {
        var keyData, key, keyLength, valueData, value, valueLength;

        var length = 0;
        var object = {};

        while ('\u0000' !== buffer.toString('utf8', length, length+1)) {
            keyData = this.unpack(buffer.slice(length));
            key       = keyData[0];
            keyLength = keyData[1];

            length += keyLength;

            valueData = this.unpack(buffer.slice(length));
            value       = valueData[0];
            valueLength = valueData[1];

            length += valueLength;

            object[key] = value;
        }
        length += 1;

        return [object, length];
    }
};

var DataType_String = {
    name: 'string',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    },

    pack: function(string) {

        var length = Buffer.byteLength(string);
        var buffer = new Buffer(4 + length);

        buffer.writeInt32LE(length, 0);
        buffer.write(string, 4, length, 'utf8');

        return buffer;
    },

    unpack: function(buffer) {
        var length = buffer.readUInt32LE(0);
        return [buffer.toString('utf8', 4, 4+length), 4+length];
    }
};

var DataType_Undefined = {
    name: 'undefined',

    condition: function(value) {
        return typeof value === 'undefined';
    },

    pack: function() {
        return new Buffer([]);
    },

    unpack: function() {
        return [undefined, 0];
    }
};


    return {
        Packer: Packer,
        DataType: {
            Undefined:      DataType_Undefined,
            Null:           DataType_Null,
            Boolean:        DataType_Boolean,
            Number:         DataType_Number,
            String:         DataType_String,
            Array:          DataType_Array,
            SimpleObject:   DataType_SimpleObject,
            Buffer:         DataType_Buffer
        }
    };

}));