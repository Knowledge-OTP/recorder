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

	var _handleError = __webpack_require__(6);

	var _handleError2 = _interopRequireDefault(_handleError);

	var _util = __webpack_require__(4);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mediaWrapperError = 'mediaWrapper not defined! maybe because \nMediaRecorder or AudioContext are not supported in this browser.';

	window.AudioContext = AudioContext || webkitAudioContext;

	var Core = function () {
	    function Core() {
	        _classCallCheck(this, Core);

	        this._mediaWrapper;
	        this._isPlaying = false;
	    }

	    _createClass(Core, [{
	        key: '_getMediaWrapper',
	        value: function _getMediaWrapper(stream) {
	            if (MediaRecorder) {
	                return new _mediaRecorderWrapper2.default(stream);
	            } else if (AudioContext) {
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

	                _this._mediaWrapper.onMediaReady = function (blob) {
	                    _util2.default.invoke(_this, 'onMediaReady', blob);
	                };
	            }, _handleError2.default.bind('MicrophoneAccess', 'can\'t get access to microphone'));
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (!this._isPlaying) {
	                return;
	            }

	            this._mediaWrapper.stop();
	            this._isPlaying = false;

	            _util2.default.invoke(this, 'onStop');
	        }
	    }], [{
	        key: 'getVersion',
	        value: function getVersion() {
	            return ("1.0.0");
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
	        this._chunks = [];
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
	                _this._chunks.push(e.data);
	            };

	            this._mediaRecorder.onstop = function (e) {
	                _this._blob = new Blob(_this._chunks, { 'type': 'audio/ogg; codecs=opus' });

	                _util2.default.invoke(_this, 'onMediaReady', _this._blob);
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
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AudioContextWrapper = function () {
	    function AudioContextWrapper(stream) {
	        _classCallCheck(this, AudioContextWrapper);

	        this._stream = stream;
	        this._chunks = [];
	    }

	    _createClass(AudioContextWrapper, [{
	        key: "start",
	        value: function start() {
	            this._stream.start();
	        }
	    }, {
	        key: "stop",
	        value: function stop() {
	            this._stream.stop();
	        }
	    }]);

	    return AudioContextWrapper;
	}();

	exports.default = AudioContextWrapper;

/***/ },
/* 6 */
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