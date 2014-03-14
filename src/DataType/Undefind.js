var DataType_Undefined = {
    name: 'undefined',

    condition: function(value) {
        return typeof value === 'undefined';
    },

    pack: function() {
        return [this.createBinary(), 0];
    },

    unpack: function() {
        return [undefined, 0];
    }
};