var DataType_Array = {
    name: 'array',
    
    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },

    pack: function(array) {
        var buffers = [];
        for (var i = 0, ii = array.length; i < ii; ++i) {
            buffers.push(this.pack(array[i]));
        }
        buffers.push(new Buffer('\u0000', 'utf8'));
        return Buffer.concat(buffers);
    },

    unpack: function(buffer) {
        var valueData, value, valueLength;

        var length = 0;
        var array  = [];

        while ('\u0000' !== buffer.toString('utf8', length, length+1)) {
            valueData = this.unpack(buffer.slice(length));
            value       = valueData[0];
            valueLength = valueData[1];

            length += valueLength;
            array.push(value);
        }
        length += 1;
        return [array, length];
    }
};