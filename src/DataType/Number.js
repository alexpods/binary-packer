var DataType_Number = {
    name: 'number',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Number]';
    },

    pack: function(number) {
        var buffer = new Buffer(8);
        buffer.writeDoubleLE(number, 0);
        return buffer;
    },

    unpack: function(buffer) {
        return [buffer.readDoubleLE(0), 8]
    }
};