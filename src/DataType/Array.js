var DataType_Array = {

    check: function(value) {
        return _.isArray(value);
    },

    pack: function(array, callback) {
        var binaries = [];
        var packer = this;

        for (var i = 0, ii = array.length; i < ii; ++i) {
            (function(value, index) {

                binaries[i] = null;
                packer.doPack(value, function(valueBinary) {
                    packer.createBinary().writeUInt32(valueBinary.getLength(), function(valueLengthBinary) {
                        binaries[index] = [valueLengthBinary, valueBinary];
                        checkBinaries();
                    });
                });

            })(array[i], i);
        }

        function checkBinaries() {
            var i, ii, hasEmpty = false;

            for (i = 0, ii = binaries.length; i < ii; ++i) {
                if (!binaries[i]) {
                    hasEmpty = true;
                    break;
                }
            }

            if (hasEmpty) {
                return;
            }

            var concatBinaries = [];
            for (i = 0, ii = binaries.length; i < ii; ++i) {
                concatBinaries = concatBinaries.concat(binaries[i]);
            }

            callback(packer.createBinary(concatBinaries));
        }
    },

    unpack: function(binary, callback) {
        var array  = [];
        var packer = this;

        readNextValue(binary, function setValue(value, binary) {
            array.push(value);
            if (!binary.getLength()) {
                callback(array);
            }
            readNextValue(binary, setValue);
        });

        function readNextValue(binary, callback) {
            binary.readUInt32(function(valueLength, binary) {
                packer.doUnpack(binary.slice(0, valueLength), function(value) {
                    callback(value, binary.slice(valueLength));
                });
            });
        }
    }
};