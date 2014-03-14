function Packer(binayMode, dataTypes) {

    this._dataTypes         = [];
    this._dataTypesIndex    = {};
    this._binaryMode        = undefined;

    Packer.init(this, binaryMode, dataTypes);
}

_.extend(Packer, {

    BINARY_MODE: {
        BUFFER: 'Buffer',
        BLOB:   'Blob'
    },

    isBinaryModeSupported: function(binaryMode) {
        var modes = this.BINARY_MODE;
        for (var name in modes) {
            if (modes[name] === binaryMode) {
                return true;
            }
        }
        return false;
    },

    init: function(that, binaryMode, dataTypes) {
        if (_.isArray(binaryMode)) {
            dataTypes  = binaryMode;
            binaryMode = undefined;
        }
        if (!binaryMode) {
            binaryMode = process && Buffer ? Packer.BINARY_MODE.BUFFER : Packer.BINARY_MODE.BLOB;
        }
        dataTypes = dataTypes || [];

        return that
            .setBinaryMode(binaryMode)
            .setDataTypes(dataTypes);
    }

});

_.extend(Transport_Packer.prototype, {

    getBinaryMode: function() {
        return this._binaryMode;
    },

    setBinaryMode: function(binaryMode) {
        if (!Packer.isBinaryModeSupported(binaryMode)) {
            throw new Error('Binary mode "' + binaryMode + '" does not supported!');
        }
        this._binaryMode = binaryMode;
        return this;
    },

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
    },

    createBinary: function() {
        switch (this.getBinaryMode()) {
            case Packer.BINARY_MODE.BUFFER: return new Binary_Buffer();
            case Packer.BINARY_MODE.BLOB:   return new Binary_Blob();
        }
    }

});
