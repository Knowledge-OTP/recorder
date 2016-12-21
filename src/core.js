import MicrophoneAccess from './microphoneAccess.js';
import MediaRecorderWrapper from './mediaRecorderWrapper.js';
import AudioContextWrapper from './audioContextWrapper.js';
import Mp3Encoder from './mp3Encoder.js';
import handleError from './handleError.js';
import util from './util.js';

let mediaWrapperError = `mediaWrapper not defined! maybe because 
MediaRecorder or AudioContext are not supported in this browser.`;

window.AudioContext = (window.AudioContext || window.webkitAudioContext);

const MEDIA_ENUM = {
    mediaRecorder: 1,
    audioContext: 2
};

const FORMAT_ENUM = {
    mp3: 1,
    wav: 2,
    ogg: 3
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
        if (window.MediaRecorder &&
            (this._options.fixedMedia !== MEDIA_ENUM.audioContext)) {
            return new MediaRecorderWrapper(stream);
        } else if (window.AudioContext &&
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
            util.invoke(this, 'onPermissonAccess');

            this._mediaWrapper = this._getMediaWrapper(stream);

            util.invoke(this._mediaWrapper, 'start');

            this._isPlaying = true;

            util.invoke(this, 'onPlay');

            this._mediaWrapper.onMediaReady = ({ blob }) => {
                util.invoke(this, 'onMediaReady', blob);
            };

        }, err => {
            util.invoke(this, 'onPermissonDenied');
            
            handleError('Core', 'Play {MicrophoneAccess}', err);
        },
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

