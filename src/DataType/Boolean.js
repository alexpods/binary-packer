var DataType_Boolean = {

    check: function(value) {
        return _.isBoolean(value);
    },

    pack: function(value, callback) {
        this.createBinary().writeUInt8(value ? 1 : 0, function(binary) {
            callback(binary);
        });
    },

    unpack: function(binary, callback) {
        binary.readUInt8(function(value) {
            callback(value);
        });
    }
};