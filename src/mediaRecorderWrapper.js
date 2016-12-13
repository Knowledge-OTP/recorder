import util from './util.js'; 

export default class MediaRecorderWrapper {
    constructor(stream) {
        this._stream = stream;
        this._samples = [];
        this._mediaRecorder;
        this._blob;
    }

    start() {
        this._mediaRecorder = new MediaRecorder(this._stream);

        this._mediaRecorder.start();

        this._mediaRecorder.ondataavailable = (e) => {
            this._samples.push(e.data);
        };

        this._mediaRecorder.onstop = (e) => {
            this._blob = new Blob(this._samples, { 'type': 'audio/ogg; codecs=opus' });

            util.invoke(this, 'onMediaReady', {
                blob: this._blob
            });             
        };
    }

    stop() {
        this._mediaRecorder.stop();
    }
}