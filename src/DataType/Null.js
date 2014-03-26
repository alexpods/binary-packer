var DataType_Null = {

    check: function(value) {
        return _.isNull(value);
    },

    pack: function(value, callback) {
        callback(this.createBinary());
    },

    unpack: function(binary, callback) {
        callback(null);
    }
};