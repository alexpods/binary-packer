function Binary_Blob(blob) {
    this._blob = undefined;

    Binary_Blob.init(this, blob);
}

_.extend(Binary_Blob, {

    init: function(that, blob) {
        if (_.isUndefined(blob)) {
            blob = new Blob([]);
        }
        if (!(blob instanceof blob)) {
            throw new Error('Blob must be instance of "Blob" class!');
        }
        that._blob = blob;
    }

});

_.extend(Binary_Blob.prototype, {

    slice: function(start, end) {
        return new Binary_Blob(this._blob.slice(start, end));
    },

    writeInt8: function(value, callback) {
        this._blob = new Blob([ this._blob, new Int8Array([value]) ]);
        callback(this);
    },

    writeInt16: function(value, callback) {
        this._blob = new Blob([ this._blob, new Int16Array([value]) ]);
        callback(this);
    },

    writeInt32: function(value, callback) {
        this._blob = new Blob([ this._blob, new Int32Array([value]) ]);
        callback(this);
    },

    writeUInt8: function(value, callback) {
        this._blob = new Blob([ this._blob, new Uint8Array([value]) ]);
        callback(this);
    },

    writeUInt16: function(value, callback) {
        this._blob = new Blob([ this._blob, new Uint16Array([value]) ]);
        callback(this);
    },

    writeUInt32: function(value, callback) {
        this._blob = new Blob([ this._blob, new Uint32Array([value]) ]);
        callback(this);
    },

    writeFloat: function(value, callback) {
        this._blob = new Blob([ this._blob, new Float32Array([value]) ]);
        callback(this);
    },

    writeDouble: function(value, callback) {
        this._blob = new Blob([ this._blob, new Float64Array([value]) ]);
        callback(this);
    },

    writeText: function(text, callback) {
        this._blob = new Blob([this._blob, text]);
        callback(this);
    },

    readInt8: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 1);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Int8Array(arrayBuffer))[0], that.slice(1));
        });
    },

    readInt16: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 2);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Int16Array(arrayBuffer))[0], that.slice(2));
        });
    },

    readInt32: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 4);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Int32Array(arrayBuffer))[0], that.slice(4));
        });
    },

    readUInt8: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 1);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Uint8Array(arrayBuffer))[0], that.slice(1));
        });
    },

    readUInt16: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 2);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Uint16Array(arrayBuffer))[0], that.slice(2));
        });
    },

    readUInt32: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 4);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Uint32Array(arrayBuffer))[0], that.slice(4));
        });
    },

    readFloat: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 4);
        this.doRead(blob, 'arrayBuffer', function(arrayBuffer) {
            callback((new Float32Array(arrayBuffer))[0], that.slice(4));
        });
    },

    readDouble: function(callback) {
        var that = this;
        var blob = this._blob.slice(0, 8);
        this.doRead(blob, 'arrayBuffer', function(error, arrayBuffer) {
            callback((new Float64Array(arrayBuffer))[0], that.slice(8));
        });
    },

    readText: function(length, callback) {
        if (_.isFunction(length)) {
            callback = length;
            length  = undefined;
        }
        if (_.isUndefined(length)) {
            length = this._blob.size;
        }
        var blob = this._blob.slice(0, length);
        var that = this;
        this.doRead(blob, 'text', function(text) {
            callback(text, that.slice(length));
        });
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