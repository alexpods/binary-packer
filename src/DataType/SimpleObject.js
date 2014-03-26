var DataType_SimpleObject = {
    name: 'simple_object',

    condition: function(value) {
        return ({}).constructor === value.constructor;
    },

    pack: function(object, callback) {
        var binaries = [];
        var packer   = this;

        for (var key in object) {
            (function(key, value) {

                var keyIndex = binaries.push(false) - 1;
                packer.doPack(key, function(keyBinary) {
                    packer.createBinary().writeUInt32(keyBinary.getLength(), function(keyLengthBinary) {
                        binaries[keyIndex] = [keyLengthBinary, keyBinary];
                        checkBinaries();
                    });

                });

                var valueIndex = binaries.push(false) - 1;
                packer.doPack(value, function(valueBinary) {
                    packer.createBinary().writeUInt32(valueBinary.getLength(), function(valueLengthBinary) {
                        binaries[valueIndex] = [valueLengthBinary, valueBinary];
                        checkBinaries();
                    });
                })

            })(key, object[key]);
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

        var object  = {};
        var packer  = this;
        var key     = null;

        readNextValue(binary, function setValue(value, binary) {
            if (key) {
                object[key] = value;
                key = null;
                if (!binary.getLength()) {
                    callback(object);
                }
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