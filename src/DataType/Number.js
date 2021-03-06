var DataType_Number = {

    check: function(value) {
        return _.isNumber(value);
    },

    pack: function(value, callback) {
        this.createBinary().writeDouble(value, function(binary) {
            callback(binary);
        });
    },

    unpack: function(binary, callback) {
        binary.readDouble(function(value) {
            callback(value);
        });
    }
};