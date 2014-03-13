var DataType_Boolean = {
    name: 'boolean',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Boolean]';
    },

    pack: function(boolean) {
        var buffer = new Buffer(1);
        buffer.writeUInt8(boolean ? 1 : 0, 0);
        return buffer;
    },

    unpack: function(buffer) {
        return [!!buffer.readUInt8(0), 1];
    }
};