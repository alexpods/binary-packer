var DataType_Buffer = {

    check: function(value) {
        return value instanceof Buffer;
    },

    pack: function(value, callback) {
        callback(this.createBinary(value));
    },

    unpack: function(binary, callback) {
        callback(binary.getBuffer());
    }
};