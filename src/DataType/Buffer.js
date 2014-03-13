var DataType_Buffer = {
    name: 'buffer',

    condition: function(value) {
        return value instanceof Buffer;
    },

    pack: function(buffer) {
        var lengthBuffer = new Buffer(4);
        lengthBuffer.writeUInt32LE(buffer.length, 0);
        return Buffer.concat([lengthBuffer, buffer]);
    },

    unpack: function(buffer) {
        var length = buffer.readUInt32LE(0);
        return [buffer.slice(4, 4+length), 4+length];
    }
};