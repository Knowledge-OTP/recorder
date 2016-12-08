export default class AudioContextWrapper {
    constructor(stream) {
        this._stream = stream;
        this._chunks = [];
    }
    
    start() {
        this._stream.start();
    }

    stop() {
        this._stream.stop();
    }
}