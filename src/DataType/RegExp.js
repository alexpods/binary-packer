var DataType_RegExp = {

    check: function(value) {
        return value instanceof RegExp;
    },

    pack: function(value, callback) {

        var global     = +value.global      << 0;
        var multiline  = +value.multiline   << 1;
        var ignoreCase = +value.ignoreCase  << 2;

        var flags = global | multiline | ignoreCase;
        var source = value.source;

        this.createBinary().writeUInt8(flags, function(flagsBinary) {
            flagsBinary.writeText(source, function(binary) {
                callback(binary);
            });
        });
    },

    unpack: function(binary, callback) {

        binary.readUInt8(function(flags, binary) {

            var global     = flags & (1 << 0);
            var multiline  = flags & (1 << 1);
            var ignoreCase = flags & (1 << 2);

            binary.readText(function(source) {
                callback(new RegExp(source, '' + (global ? 'g' : '') + (multiline ? 'm' : '') + (ignoreCase ? 'i' : '')));
            });
        });
    }
};