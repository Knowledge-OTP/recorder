/**
 * MicrophoneAccess
 *  use it to get access to microphone
 *  will try to access throuh the new api navigator.mediaDevices.getUserMedia,
 *  if it's not supported will try the older depercted api navigator.getUserMedia
*/

/**
 *  @param {function} successCallback return stream
 *  @param {function} errorCallback
 */
function getMicrophoneAccess(successCallback, errorCallback) {
    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(successCallback)
            .catch(errorCallback);

    } else if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true }, successCallback, errorCallback);

    } else {
        errorCallback('mediaDevices.getUserMedia and getUserMedia not supported in this browser.');
    }
}

const MicrophoneAccess = {
     getMicrophoneAccess
};

export default MicrophoneAccess;
