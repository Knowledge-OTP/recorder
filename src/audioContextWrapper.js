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
    }

    start() {
        this._mediaRecorder = new (window.AudioContext || window.webkitAudioContext)();

        this._sampleRate = this._mediaRecorder.sampleRate;

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
        };

        this._volume.connect(this._recorder);
        this._recorder.connect(this._mediaRecorder.destination);
    }

    stop() {
        this._mediaRecorder.suspend();

        var audioData = exportWav(this); 
        var wav = lamejs.WavHeader.readHeader(audioData.view);
        var samples = new Int16Array(audioData.view, wav.dataOffset, wav.dataLen / 2);
        console.log('audioData', audioData);
        console.log('wav', wav);
                console.log('samples', wav);
     
         util.invoke(this, 'onMediaReady', {
                samples: audioData.buffer,
                blob: audioData.blob
         }); 
    }
}


function mergeBuffers(channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}

function interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}


function writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function exportWav(self) {
    const leftBuffer = mergeBuffers(self._leftchannel, self._recordingLength);
    const rightBuffer = mergeBuffers(self._rightchannel, self._recordingLength);

    const interleaved = interleave(leftBuffer, rightBuffer);

    const buffer = new ArrayBuffer(44 + interleaved.length * 2);
    let view = new DataView(buffer);

    // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, self._sampleRate, true);
    view.setUint32(28, self._sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    const lng = interleaved.length;
    let index = 44;
    const volume = 1;
    for (var i = 0; i < lng; i++) {
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

    return  { 
        blob: new Blob([view], { type: 'audio/wav' }),
        buffer,
        view
    }
}