var RaccoonRecorder =
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

	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var MEDIA_ENUM = {
	    mediaRecorder: 1,
	    audioContext: 2
	};

	var FORMAT_ENUM = {
	    mp3: 1,
	    wav: 2,
	    ogg: 3
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
	            if (window.MediaRecorder && this._options.fixedMedia !== MEDIA_ENUM.audioContext) {
	                return new _mediaRecorderWrapper2.default(stream);
	            } else if (window.AudioContext && this._options.fixedMedia !== MEDIA_ENUM.mediaRecorder) {
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
	                _util2.default.invoke(_this, 'onPermissonAccess');

	                _this._mediaWrapper = _this._getMediaWrapper(stream);

	                _util2.default.invoke(_this._mediaWrapper, 'start');

	                _this._isPlaying = true;

	                _util2.default.invoke(_this, 'onPlay');

	                _this._mediaWrapper.onMediaReady = function (_ref) {
	                    var blob = _ref.blob;

	                    _util2.default.invoke(_this, 'onMediaReady', blob);
	                };
	            }, function (err) {
	                _util2.default.invoke(_this, 'onPermissonDenied');

	                (0, _handleError2.default)('Core', 'Play {MicrophoneAccess}', err);
	            }, this._options.skylinkAppKey);
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

	    if (Skylink) {

	        AdapterJS.webRTCReady(function (isUsingPlugin) {
	            navigator.getUserMedia({ audio: true }, successCallback, errorCallback);
	        });
	    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

	        navigator.mediaDevices.getUserMedia({ audio: true }).then(successCallback).catch(errorCallback);
	    } else if (navigator.getUserMedia) {

	        navigator.getUserMedia({ audio: true }, successCallback, errorCallback);
	    } /* else if (Skylink) {
	          const skylink = new Skylink();
	          skylink.init({ appKey }, function (initErr, initSuccess) {
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
	      } */else {
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

	            this._mediaRecorder = new window.MediaRecorder(this._stream);

	            this._mediaRecorder.start();

	            this._mediaRecorder.ondataavailable = function (e) {
	                _this._samples.push(e.data);
	            };

	            this._mediaRecorder.onstop = function (e) {
	                _this._blob = new Blob(_this._samples, { 'type': 'audio/ogg; codecs=opus' });

	                _util2.default.invoke(_this, 'onMediaReady', {
	                    blob: _this._blob
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

	var _mp3Encoder = __webpack_require__(6);

	var _mp3Encoder2 = _interopRequireDefault(_mp3Encoder);

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
	                this._numberOfChannels;
	                this._mp3Encoder;
	                this._buffers = [];
	        }

	        _createClass(AudioContextWrapper, [{
	                key: 'start',
	                value: function start() {
	                        var _this = this;

	                        this._mediaRecorder = new (window.AudioContext || window.webkitAudioContext)();

	                        this._mp3Encoder = new _mp3Encoder2.default({ context: this._mediaRecorder });

	                        this._mp3Encoder.initialize();

	                        this._sampleRate = this._mediaRecorder.sampleRate;

	                        this._numberOfChannels = this._mediaRecorder.numberOfChannels;

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

	                                _this._mp3Encoder.onProcess(left);
	                        };

	                        this._volume.connect(this._recorder);
	                        this._recorder.connect(this._mediaRecorder.destination);

	                        this._mp3Encoder.onMp3Data = function (buf) {
	                                _this._buffers.push(buf);
	                        };
	                }
	        }, {
	                key: 'stop',
	                value: function stop() {
	                        var _this2 = this;

	                        this._mp3Encoder.finish();

	                        this._mp3Encoder.onMp3End = function (buf) {
	                                _this2._buffers.push(buf);

	                                _util2.default.invoke(_this2, 'onMediaReady', {
	                                        blob: new Blob(_this2._buffers, { type: 'audio/mp3' })
	                                });
	                        };

	                        this._mediaRecorder.close();

	                        this._audioInput.disconnect();
	                        this._recorder.disconnect();

	                        this._audioInput = undefined;
	                        this._recorder = undefined;
	                }
	        }]);

	        return AudioContextWrapper;
	}();

	exports.default = AudioContextWrapper;

/***/ },
/* 6 */
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

	var Mp3Encoder = function () {
	    function Mp3Encoder(_ref) {
	        var context = _ref.context;

	        _classCallCheck(this, Mp3Encoder);

	        var workerScript = document.querySelector('#mp3Worker').src;
	        this._encodingWorker = new Worker(workerScript);
	    }

	    _createClass(Mp3Encoder, [{
	        key: 'initialize',
	        value: function initialize() {
	            var _this = this;

	            this._encodingWorker.postMessage({ cmd: 'init', config: { channels: 2, samplerate: 48000, bitrate: 32 } });

	            this._encodingWorker.onmessage = function (e) {
	                if (e.data.cmd === 'data') {
	                    _util2.default.invoke(_this, 'onMp3Data', e.data.buf);
	                }

	                if (e.data.cmd === 'end') {
	                    _util2.default.invoke(_this, 'onMp3End', e.data.buf);
	                }
	            };
	        }
	    }, {
	        key: 'onProcess',
	        value: function onProcess(left) {
	            this._encodingWorker.postMessage({ cmd: 'encode', buf: left });
	        }
	    }, {
	        key: 'finish',
	        value: function finish() {
	            this._encodingWorker.postMessage({ cmd: 'finish' });
	        }
	    }]);

	    return Mp3Encoder;
	}();

	exports.default = Mp3Encoder;

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