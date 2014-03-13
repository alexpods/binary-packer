var DataType_Null = {
    name: 'null',

    condition: function(value) {
        return value === null;
    },

    pack: function() {
        return new Buffer([]);
    },

    unpack: function() {
        return [null, 0];
    }
};