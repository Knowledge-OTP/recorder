import MicrophoneAccess from './microphoneAccess.js';
import MediaRecorderWrapper from './mediaRecorderWrapper.js';
import AudioContextWrapper from './audioContextWrapper.js';
import Mp3Encoder from './mp3Encoder.js';
import handleError from './handleError.js';
import util from './util.js';

let mediaWrapperError = `mediaWrapper not defined! maybe because 
MediaRecorder or AudioContext are not supported in this browser.`;

window.AudioContext = (AudioContext || webkitAudioContext);

const MEDIA_ENUM = {
    mediaRecorder: 1,
    audioContext: 2
};

class Core {
    constructor(options) {
        this._mediaWrapper;
        this._isPlaying = false;
        this._options = options || {};
    }

    static get VERSION() {
        return VERSION;
    }

    static get MEDIA_ENUM() {
        return MEDIA_ENUM;
    }

    _getMediaWrapper(stream) {
        if (MediaRecorder &&
            (this._options.fixedMedia !== MEDIA_ENUM.audioContext)) {
            return new MediaRecorderWrapper(stream);
        } else if (AudioContext &&
            (this._options.fixedMedia !== MEDIA_ENUM.mediaRecorder)) {
            return new AudioContextWrapper(stream);
        } else {
            handleError('Core', '_getMediaWrapper', mediaWrapperError);
        }

        return {};
    }

    play() {
        if (this._isPlaying) {
            return;
        }

        MicrophoneAccess.getMicrophoneAccess(stream => {
            this._mediaWrapper = this._getMediaWrapper(stream);

            util.invoke(this._mediaWrapper, 'start');

            this._isPlaying = true;

            util.invoke(this, 'onPlay');

            this._mediaWrapper.onMediaReady = ({ samples, blob }) => {
                util.invoke(this, 'onMediaReady', blob);

                if (util.isFunction(this.onMp3Ready)) {
                    var mp3Encoder = Mp3Encoder(samples);
                    this.onMp3Ready(mp3Encoder.blob);
                }
            };

        },
            handleError.bind('MicrophoneAccess', `can't get access to microphone`),
            this._options.skylinkAppKey
        );
    }

    stop() {
        if (!this._isPlaying) {
            return;
        }

        util.invoke(this._mediaWrapper, 'stop');

        this._isPlaying = false;

        util.invoke(this, 'onStop');
    }
};

export default Core;

