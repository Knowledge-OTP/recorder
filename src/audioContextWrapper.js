import Mp3Encoder from './mp3Encoder.js';
import util from './util.js';

export default class AudioContextWrapper {
    constructor(stream) {
        this._stream = stream;
        this._mediaRecorder;
        this._sampleRate;
        this._audioInput;
        this._volume;
        this._recorder;
        this._leftchannel = [];
        this._rightchannel = [];
        this._recordingLength = 0;
        this._numberOfChannels;
        this._mp3Encoder;
        this._buffers = [];
    }

    start() {
        this._mediaRecorder = new (window.AudioContext || window.webkitAudioContext)();

        this._mp3Encoder = new Mp3Encoder({ context: this._mediaRecorder });

        this._mp3Encoder.initialize();

        this._sampleRate = this._mediaRecorder.sampleRate;

        this._numberOfChannels = this._mediaRecorder.numberOfChannels;

        this._volume = this._mediaRecorder.createGain();

        this._audioInput = this._mediaRecorder.createMediaStreamSource(this._stream);

        this._audioInput.connect(this._volume);

        const bufferSize = 2048;
        this._recorder = this._mediaRecorder.createScriptProcessor(bufferSize, 2, 2);

        this._recorder.onaudioprocess = e => {
            let left = e.inputBuffer.getChannelData(0);
            let right = e.inputBuffer.getChannelData(1);

            this._leftchannel.push(new Float32Array(left));
            this._rightchannel.push(new Float32Array(right));
            this._recordingLength += bufferSize;

            this._mp3Encoder.onProcess(left);
        };
        
        this._volume.connect(this._recorder);
        this._recorder.connect(this._mediaRecorder.destination);

        this._mp3Encoder.onMp3Data = (buf) => {
            this._buffers.push(buf);
        };
    }

    stop() {
        this._mp3Encoder.finish();

        this._mp3Encoder.onMp3End = (buf) => {
            this._buffers.push(buf);

            util.invoke(this, 'onMediaReady', {
                blob: new Blob(this._buffers, { type: 'audio/mp3' })
            });
        };
     
        this._mediaRecorder.close();

        this._audioInput.disconnect();
        this._recorder.disconnect();

        this._audioInput = undefined;
        this._recorder = undefined;
    }
}