var DataType_Undefined = {

    check: function(value) {
        return _.isUndefined(value);
    },

    pack: function(value, callback) {
        callback(this.createBinary());
    },

    unpack: function(binary, callback) {
        callback(undefined);
    }
};