var DataType_Undefined = {
    name: 'undefined',

    condition: function(value) {
        return typeof value === 'undefined';
    },

    pack: function() {
        return new Buffer([]);
    },

    unpack: function() {
        return [undefined, 0];
    }
};