import util from './util.js';

export default class Mp3Encoder {
    constructor({ context }) {
        let workerScript = document.querySelector('#mp3worker').src;
        this._encodingWorker = new Worker(workerScript);
    }

    initialize() {
        this._encodingWorker.postMessage({ cmd: 'init', config: { channels: 2, samplerate: 48000, bitrate: 32 } });

        this._encodingWorker.onmessage = (e) => {
            if (e.data.cmd === 'data') {
                util.invoke(this, 'onMp3Data', e.data.buf);
            }

            if (e.data.cmd === 'end') {
                util.invoke(this, 'onMp3End', e.data.buf);
            }
        };
    }

    onProcess(left) {
        this._encodingWorker.postMessage({ cmd: 'encode', buf: left });
    }

    finish() {
        this._encodingWorker.postMessage({ cmd: 'finish' });
    }

}