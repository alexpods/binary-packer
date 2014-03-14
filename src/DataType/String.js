var DataType_String = {
    name: 'string',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    },

    pack: function(string) {

        var length = Binary.countByteLength(string);
        var buffer = new Buffer(4 + length);

        buffer.writeInt32LE(length, 0);
        buffer.write(string, 4, length, 'utf8');

        return buffer;
    },

    unpack: function(buffer) {
        var length = buffer.readUInt32LE(0);
        return [buffer.toString('utf8', 4, 4+length), 4+length];
    }
};