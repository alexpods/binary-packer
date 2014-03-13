var DataType_SimpleObject = {
    name: 'simple_object',

    condition: function(value) {
        return ({}).constructor === value.constructor;
    },

    pack: function(object) {
        var buffers = [];
        for (var param in object) {
            buffers.push(this.pack(param));
            buffers.push(this.pack(object[param]));
        }
        buffers.push(new Buffer('\u0000', 'utf8'));
        return Buffer.concat(buffers);
    },

    unpack: function(buffer) {
        var keyData, key, keyLength, valueData, value, valueLength;

        var length = 0;
        var object = {};

        while ('\u0000' !== buffer.toString('utf8', length, length+1)) {
            keyData = this.unpack(buffer.slice(length));
            key       = keyData[0];
            keyLength = keyData[1];

            length += keyLength;

            valueData = this.unpack(buffer.slice(length));
            value       = valueData[0];
            valueLength = valueData[1];

            length += valueLength;

            object[key] = value;
        }
        length += 1;

        return [object, length];
    }
};