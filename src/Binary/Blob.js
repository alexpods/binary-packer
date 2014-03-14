function Binary_Blob() {
    this._blob = undefined;

    Binary_Blob.init(this);
}

_.extend(Binary_Blob, {

});

_.extend(Binary_Blob.prototype, {

    read: function(type, offset, length, callback) {
        if (_.isFunction(length)) {
            callback = length;
            length   = undefined;
        }
        if (_.isFunction(offset)) {
            callback = offset;
            offset   = undefined;
        }
        offset = offset || 0;
        length = length || this._blob.size;

        var reader = new FileReader();

        reader.onabort = function() {
            throw new Error('Blob reading was aborted!');
        };

        reader.onerror = function() {
            throw new Error('Blob reading was quit with error: ' + reader.error);
        };

        reader.onload = function() {
            callback(onLoad(reader.result));
        };

        var onLoad = function(result) { return result };

        switch (type) {
            case 'int':
                onLoad = function(arrayBuffer) {
                    switch (length) {
                        case 1: return (new Int8Array(arrayBuffer))[0];
                        case 2: return (new Int16Array(arrayBuffer))[0];
                        case 4: return (new Int32Array(arrayBuffer))[0];
                        default:
                            throw new Error('Incorrect length "' + length + '"!');
                    }
                };
                reader.readAsArrayBuffer(this._blob.slice(offset, length));
                break;

            case 'uint':
                onLoad = function(arrayBuffer) {
                    switch (length) {
                        case 1: return (new Uint8Array(arrayBuffer))[0];
                        case 2: return (new Uint16Array(arrayBuffer))[0];
                        case 4: return (new Uint32Array(arrayBuffer))[0];
                        default:
                            throw new Error('Incorrect length "' + length + '"!');
                    }
                };
                reader.readAsArrayBuffer(this._blob.slice(offset,  length));
                break;

            case 'float':
                onLoad = function(arrayBuffer) {
                    switch (length) {
                        case 4: return (new Float32Array(arrayBuffer))[0];
                        case 8: return (new Float64Array(arrayBuffer))[0];
                        default:
                            throw new Error('Incorrect length "' + length + '"!');
                    }
                };
                reader.readAsArrayBuffer(this._blob.slice(offset,length));
                break;

            case 'string':
                reader.readAsText(this._blob.slice(offset, length));
                break;
        }
    },

    write: function(type, offset, data, callback) {
        switch (type) {

            case 'int':
                break;

            case 'uint':
                break;

            case 'float':
                break;

            case 'string':
                break;
        }
    }

});