var DataType_String = {

    check: function(value) {
        return _.isString(value);
    },

    pack: function(value, callback) {
        this.createBinary().writeText(value, function(binary) {
            callback(binary);
        });
    },

    unpack: function(binary, callback) {
        binary.readText(function(value) {
            callback(value);
        });
    }
};