var MicrophoneAccess = require('../src/microphoneAccess.js');

var MicrophoneAccessDefault = MicrophoneAccess.default;

describe('test for microphoneAccess service', function () {

    it('when import the service should have a getMicrophoneAccess function', function () {
        expect(MicrophoneAccessDefault.getMicrophoneAccess).toBeDefined();
    });

});

