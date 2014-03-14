var DataType_Number = {
    name: 'number',

    condition: function(value) {
        return Object.prototype.toString.call(value) === '[object Number]';
    },

    pack: function(number, callback) {
        var binary = this.createBinary(); new Buffer(8);
        binary.write('Float64', number, function() {
            callback(binary);
        });
    },

    unpack: function(binary, callback) {
        binary.read('Float64', function(number) {
            callback(number, 8);
        });
    }
};