function Binary_Buffer(buffer) {
    this._buffer = undefined;

    Binary_Buffer.init(this, buffer);
}

_.extend(Binary_Buffer, {

    init: function(that, buffer) {
        if (_.isUndefined(buffer)) {
            buffer = new Buffer(0);
        }
        if (!(buffer instanceof blob)) {
            throw new Error('Buffer must be instance of "Buffer" class!');
        }
        that._buffer = buffer;
    }

});

_.extend(Binary_Blob.prototype, {

    slice: function(start, end) {
        return new Binary_Buffer(this._buffer.slice(start, end));
    },

    writeInt8: function(value, callback) {
        var valueBuffer = new Buffer(1);
        valueBuffer.writeInt8(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeInt16: function(value, callback) {
        var valueBuffer = new Buffer(2);
        valueBuffer.writeInt16BE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeInt32: function(value, callback) {
        var valueBuffer = new Buffer(4);
        valueBuffer.writeInt32BE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeUInt8: function(value, callback) {
        var valueBuffer = new Buffer(1);
        valueBuffer.writeUInt8(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeUInt16: function(value, callback) {
        var valueBuffer = new Buffer(2);
        valueBuffer.writeUInt16BE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeUInt32: function(value, callback) {
        var valueBuffer = new Buffer(4);
        valueBuffer.writeUInt16BE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },


    writeFloat: function(value, callback) {
        var valueBuffer = new Buffer(4);
        valueBuffer.writeFloatBE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeDouble: function(value, callback) {
        var valueBuffer = new Buffer(8);
        valueBuffer.writeDoubleBE(value);

        this._buffer = Buffer.concat([ this._buffer, valueBuffer ]);

        callback(this);
    },

    writeText: function(text, callback) {
        this._buffer = Buffer.concat([ this._buffer, new Buffer(value, 'utf8') ]);

        callback(this);
    },

    readInt8: function(callback) {
        var value = this._buffer.readInt8(0);
        callback(value, this.slice(1));
    },

    readInt16: function(callback) {
        var value = this._buffer.readInt16BE(0);
        callback(value, this.slice(2));
    },

    readInt32: function(callback) {
        var value = this._buffer.readInt32BE(0);
        callback(value, this.slice(4));
    },

    readUInt8: function(callback) {
        var value = this._buffer.readUInt8(0);
        callback(value, this.slice(1));

    },

    readUInt16: function(callback) {
        var value = this._buffer.readUInt16BE(0);
        callback(value, this.slice(2));

    },

    readUInt32: function(callback) {
        var value = this._buffer.readUInt32BE(0);
        callback(value, this.slice(4));
    },

    readFloat: function(callback) {
        var value = this._buffer.readFloatBE(0);
        callback(value, this.slice(4));
    },

    readDouble: function(callback) {
        var value = this._buffer.readDoubleBE(0);
        callback(value, this.slice(8));
    },

    readText: function(length, callback) {
        if (_.isFunction(callback)) {
            callback = length;
            length   = undefined;
        }
        if (_.isUndefined(length)) {
            length = this._buffer.length;
        }

        var value = this._buffer.slice(0, length).toString('utf8');
        callback(value, this.slice(length));
    },

    doRead: function(blob, type, callback) {
        var reader = new FileReader();

        reader.onabort = function() {
            throw new Error('Blob reading was aborted!');
        };
        reader.onerror = function() {
            throw reader.error;
        };
        reader.onload = function() {
            callback(reader.result);
        };

        switch (type) {
            case 'arrayBuffer':
                reader.readAsArrayBuffer(blob);
                break;

            case 'text':
                reader.readAsText(blob);
                break;

            default:
                throw new Error('Incorrect type "' + type + '"!');
        }
    }

});