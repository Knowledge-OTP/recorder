import MicrophoneAccess from './microphoneAccess.js';
import MediaRecorderWrapper from './mediaRecorderWrapper.js';
import AudioContextWrapper from './audioContextWrapper.js';
import handleError from './handleError.js'
import util from './util.js';

let mediaWrapperError = `mediaWrapper not defined! maybe because mediaDevices.getUserMedia and 
getUserMedia and MediaRecorder or AudioContext are not supported in this browser.`;

const mediaWrapperDefault = {
    start: () => {
        handleError('Core', 'mediaWrapper start', mediaWrapperError);
    },
    stop: () => {
        handleError('Core', 'mediaWrapper stop', mediaWrapperError);
    }
};

window.AudioContext = (AudioContext || webkitAudioContext);

class Core {
    constructor() {
        this._mediaWrapper = mediaWrapperDefault;
        this._isPlaying = false;
    }

    static getVersion() {
        return VERSION;
    }

    _getMediaWrapper(stream) {
        if (MediaRecorder) {
            return new MediaRecorderWrapper(stream);
        } else if (AudioContext) {
            return new AudioContextWrapper(stream);
        }

        return mediaWrapperDefault;
    }

    play() {
        if (this._isPlaying) {
            return;
        }

        MicrophoneAccess.getMicrophoneAccess(stream => {
            this._mediaWrapper = this._getMediaWrapper(stream);
            this._mediaWrapper.start();
            this._isPlaying = true;

            if (util.isFunction(this.onPlay)) {
                this.onPlay();
            }

            this._mediaWrapper.onMediaReady = (blob) => {
                if (util.isFunction(this.onMediaReady)) {
                    this.onMediaReady(blob);
                }
            };

        },
            handleError.bind('MicrophoneAccess', `can't get access to microphone`)
        );
    }

    stop() {
        if (!this._isPlaying) {
            return;
        }

        this._mediaWrapper.stop();
        this._isPlaying = false;

        if (util.isFunction(this.onStop)) {
            this.onStop();
        }
    }
};

export default Core;