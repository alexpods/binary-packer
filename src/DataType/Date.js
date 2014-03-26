var DataType_Date = {

    check: function(value) {
        return value instanceof Date;
    },

    pack: function(value, callback) {
        this.createBinary().writeDouble(value.getTime(), function(binary) {
            callback(binary);
        });
    },

    unpack: function(binary, callback) {
        binary.readDouble(function(value) {
            callback(new Date(value));
        });
    }
};