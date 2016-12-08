import util from './util.js'; 

export default class MediaRecorderWrapper {
    constructor(stream) {
        this._stream = stream;
        this._chunks = [];
        this._mediaRecorder;
        this._blob;
    }

    start() {
        this._mediaRecorder = new MediaRecorder(this._stream);

        this._mediaRecorder.start();

        this._mediaRecorder.ondataavailable = (e) => {
            this._chunks.push(e.data);
        };

        this._mediaRecorder.onstop = (e) => {
            this._blob = new Blob(this._chunks, { 'type': 'audio/ogg; codecs=opus' });

            if (util.isFunction(this.onMediaReady)) {
                this.onMediaReady(this._blob);
            }
        };
    }

    stop() {
        this._mediaRecorder.stop();
    }
}