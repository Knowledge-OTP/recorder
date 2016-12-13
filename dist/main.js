var raccoonRecorder =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _core2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _microphoneAccess = __webpack_require__(2);

	var _microphoneAccess2 = _interopRequireDefault(_microphoneAccess);

	var _mediaRecorderWrapper = __webpack_require__(3);

	var _mediaRecorderWrapper2 = _interopRequireDefault(_mediaRecorderWrapper);

	var _audioContextWrapper = __webpack_require__(5);

	var _audioContextWrapper2 = _interopRequireDefault(_audioContextWrapper);

	var _mp3Encoder = __webpack_require__(6);

	var _mp3Encoder2 = _interopRequireDefault(_mp3Encoder);

	var _handleError = __webpack_require__(7);

	var _handleError2 = _interopRequireDefault(_handleError);

	var _util = __webpack_require__(4);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mediaWrapperError = 'mediaWrapper not defined! maybe because \nMediaRecorder or AudioContext are not supported in this browser.';

	window.AudioContext = AudioContext || webkitAudioContext;

	var MEDIA_ENUM = {
	    mediaRecorder: 1,
	    audioContext: 2
	};

	var Core = function () {
	    function Core(options) {
	        _classCallCheck(this, Core);

	        this._mediaWrapper;
	        this._isPlaying = false;
	        this._options = options || {};
	    }

	    _createClass(Core, [{
	        key: '_getMediaWrapper',
	        value: function _getMediaWrapper(stream) {
	            if (MediaRecorder && this._options.fixedMedia !== MEDIA_ENUM.audioContext) {
	                return new _mediaRecorderWrapper2.default(stream);
	            } else if (AudioContext && this._options.fixedMedia !== MEDIA_ENUM.mediaRecorder) {
	                return new _audioContextWrapper2.default(stream);
	            } else {
	                (0, _handleError2.default)('Core', '_getMediaWrapper', mediaWrapperError);
	            }

	            return {};
	        }
	    }, {
	        key: 'play',
	        value: function play() {
	            var _this = this;

	            if (this._isPlaying) {
	                return;
	            }

	            _microphoneAccess2.default.getMicrophoneAccess(function (stream) {
	                _this._mediaWrapper = _this._getMediaWrapper(stream);

	                _util2.default.invoke(_this._mediaWrapper, 'start');

	                _this._isPlaying = true;

	                _util2.default.invoke(_this, 'onPlay');

	                _this._mediaWrapper.onMediaReady = function (_ref) {
	                    var samples = _ref.samples,
	                        blob = _ref.blob;

	                    _util2.default.invoke(_this, 'onMediaReady', blob);

	                    if (_util2.default.isFunction(_this.onMp3Ready)) {
	                        getArrayBuffer(blob, function (audioBuffer) {
	                            // var wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
	                            // var data = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
	                            // var mp3Encoder = Mp3Encoder(data);
	                            console.log(audioBuffer);
	                            var sampleRate = audioBuffer.sampleRate;
	                            var numberOfChannels = audioBuffer.numberOfChannels;
	                            var ld = audioBuffer.getChannelData(0);
	                            var rd = numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;
	                            var c = lameEncode(ld, rd, sampleRate, function (progress) {
	                                console.log(progress);
	                            });
	                            _this.onMp3Ready(c);
	                        });
	                    }
	                };
	            }, _handleError2.default.bind('MicrophoneAccess', 'can\'t get access to microphone'), this._options.skylinkAppKey);
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (!this._isPlaying) {
	                return;
	            }

	            _util2.default.invoke(this._mediaWrapper, 'stop');

	            this._isPlaying = false;

	            _util2.default.invoke(this, 'onStop');
	        }
	    }], [{
	        key: 'VERSION',
	        get: function get() {
	            return ("1.0.0");
	        }
	    }, {
	        key: 'MEDIA_ENUM',
	        get: function get() {
	            return MEDIA_ENUM;
	        }
	    }]);

	    return Core;
	}();

	;

	exports.default = Core;


	function getArrayBuffer(blob, cb) {
	    var fileReader = new FileReader();
	    fileReader.onload = function () {
	        cb(this.result);
	    };
	    fileReader.readAsArrayBuffer(blob);
	}

	function lameEncode(l, r, sampleRate, progress) {
	    var liblame = new lamejs();
	    var mp3Encoder = new liblame.Mp3Encoder(2, sampleRate, 128); //2 channel hard coded :-/

	    var blockSize = 1152;
	    var blocks = [];
	    var mp3Buffer;

	    var length = l.length;
	    for (var i = 0; i < length; i += blockSize) {
	        progress(i / length * 100);
	        var lc = l.subarray(i, i + blockSize);
	        var rc = r.subarray(i, i + blockSize);
	        mp3Buffer = mp3Encoder.encodeBuffer(lc, rc);
	        if (mp3Buffer.length > 0) blocks.push(mp3Buffer);
	    }
	    mp3Buffer = mp3Encoder.flush();
	    if (mp3Buffer.length > 0) blocks.push(mp3Buffer);
	    progress(100);
	    return new Blob(blocks, { type: 'audio/mpeg' });
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * MicrophoneAccess
	 *  use it to get access to microphone
	 *  will try to access throuh the new api navigator.mediaDevices.getUserMedia,
	 *  if it's not supported will try the older depercted api navigator.getUserMedia
	 *  if it's not supported (ie: safari) will try to use the Skylink webrtc plugin if exist
	*/

	/**
	 *  @param {function} successCallback return stream
	 *  @param {function} errorCallback
	 *  @param {string} [appKey] Skylink appKey
	 */
	function getMicrophoneAccess(successCallback, errorCallback, appKey) {
	    if (!navigator.getUserMedia) {
	        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	    }

	    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	        navigator.mediaDevices.getUserMedia({ audio: true }).then(successCallback).catch(errorCallback);
	    } else if (navigator.getUserMedia) {

	        navigator.getUserMedia({ audio: true }, successCallback, errorCallback);
	    } else if (Skylink) {
	        (function () {

	            var skylink = new Skylink();

	            skylink.init({ appKey: appKey }, function (initErr, initSuccess) {
	                skylink.getUserMedia({
	                    audio: true
	                }, function (error, success) {
	                    if (error) {
	                        errorCallback(error);
	                        return;
	                    }
	                    successCallback(success);
	                });
	            });
	        })();
	    } else {
	        errorCallback('mediaDevices.getUserMedia and getUserMedia not supported in this browser.');
	    }
	}

	var MicrophoneAccess = {
	    getMicrophoneAccess: getMicrophoneAccess
	};

	exports.default = MicrophoneAccess;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(4);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MediaRecorderWrapper = function () {
	    function MediaRecorderWrapper(stream) {
	        _classCallCheck(this, MediaRecorderWrapper);

	        this._stream = stream;
	        this._samples = [];
	        this._mediaRecorder;
	        this._blob;
	    }

	    _createClass(MediaRecorderWrapper, [{
	        key: 'start',
	        value: function start() {
	            var _this = this;

	            this._mediaRecorder = new MediaRecorder(this._stream);

	            this._mediaRecorder.start();

	            this._mediaRecorder.ondataavailable = function (e) {
	                _this._samples.push(e.data);
	            };

	            this._mediaRecorder.onstop = function (e) {
	                _this._blob = new Blob(_this._samples, { 'type': 'audio/ogg; codecs=opus' });

	                _util2.default.invoke(_this, 'onMediaReady', {
	                    blob: _this._blob,
	                    samples: _this._samples
	                });
	            };
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this._mediaRecorder.stop();
	        }
	    }]);

	    return MediaRecorderWrapper;
	}();

	exports.default = MediaRecorderWrapper;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var util = {
	    isFunction: function isFunction(fn) {
	        return typeof fn === 'function';
	    },
	    isArray: function isArray(arr) {
	        return arr instanceof Array;
	    },

	    /**
	    * invoke function only if exist and function
	    * created to avoid using if statements 
	    */
	    invoke: function invoke(object, fnName, data) {
	        if (!object || !fnName) {
	            return;
	        }

	        var fn = object[fnName];

	        if (this.isFunction(fn)) {
	            data = data && this.isArray(data) ? data : [data];
	            return fn.apply(object, data);
	        }
	    }
	};

	exports.default = util;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(4);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AudioContextWrapper = function () {
	    function AudioContextWrapper(stream) {
	        _classCallCheck(this, AudioContextWrapper);

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

	    _createClass(AudioContextWrapper, [{
	        key: 'start',
	        value: function start() {
	            var _this = this;

	            this._mediaRecorder = new (window.AudioContext || window.webkitAudioContext)();

	            this._sampleRate = this._mediaRecorder.sampleRate;

	            this._volume = this._mediaRecorder.createGain();

	            this._audioInput = this._mediaRecorder.createMediaStreamSource(this._stream);

	            this._audioInput.connect(this._volume);

	            var bufferSize = 2048;
	            this._recorder = this._mediaRecorder.createScriptProcessor(bufferSize, 2, 2);

	            this._recorder.onaudioprocess = function (e) {
	                var left = e.inputBuffer.getChannelData(0);
	                var right = e.inputBuffer.getChannelData(1);

	                _this._leftchannel.push(new Float32Array(left));
	                _this._rightchannel.push(new Float32Array(right));
	                _this._recordingLength += bufferSize;
	            };

	            this._volume.connect(this._recorder);
	            this._recorder.connect(this._mediaRecorder.destination);
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this._mediaRecorder.suspend();

	            var audioData = exportWav(this);
	            var wav = lamejs.WavHeader.readHeader(audioData.view);
	            var samples = new Int16Array(audioData.view, wav.dataOffset, wav.dataLen / 2);
	            console.log('audioData', audioData);
	            console.log('wav', wav);
	            console.log('samples', wav);

	            _util2.default.invoke(this, 'onMediaReady', {
	                samples: audioData.buffer,
	                blob: audioData.blob
	            });
	        }
	    }]);

	    return AudioContextWrapper;
	}();

	exports.default = AudioContextWrapper;


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
	    var leftBuffer = mergeBuffers(self._leftchannel, self._recordingLength);
	    var rightBuffer = mergeBuffers(self._rightchannel, self._recordingLength);

	    var interleaved = interleave(leftBuffer, rightBuffer);

	    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
	    var view = new DataView(buffer);

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
	    var lng = interleaved.length;
	    var index = 44;
	    var volume = 1;
	    for (var i = 0; i < lng; i++) {
	        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
	        index += 2;
	    }

	    return {
	        blob: new Blob([view], { type: 'audio/wav' }),
	        buffer: buffer,
	        view: view
	    };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Mp3Encoder;
	function Mp3Encoder(samples) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    var channels = 2 || options.channels;
	    var sampleRate = 44100 || options.sampleRate;
	    var kbps = 128 || options.kbps;

	    var mp3encoder = new lamejs.Mp3Encoder(2, 44100, 128);
	    var mp3Data = [];

	    var left = new Int16Array(44100);
	    var right = new Int16Array(44100);
	    var sampleBlockSize = 1152;

	    for (var i = 0; i < samples.length; i += sampleBlockSize) {
	        var leftChunk = left.subarray(i, i + sampleBlockSize);
	        var rightChunk = right.subarray(i, i + sampleBlockSize);
	        var mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
	        if (mp3buf.length > 0) {
	            mp3Data.push(mp3buf);
	        }
	    }
	    var mp3buf = mp3encoder.flush();

	    if (mp3buf.length > 0) {
	        mp3Data.push(mp3buf);
	    }

	    var blob = new Blob(mp3Data, { type: 'audio/mp3' });

	    return { blob: blob, mp3Data: mp3Data };
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = handleError;
	function handleError(serviceName, title, e) {
	    console.error(serviceName + " " + title + ": " + e);
	}

/***/ }
/******/ ]);