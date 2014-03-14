var DataType_Null = {
    name: 'null',

    condition: function(value) {
        return value === null;
    },

    pack: function() {
        return [this.createBinary(), 0];
    },

    unpack: function() {
        return [null, 0];
    }
};