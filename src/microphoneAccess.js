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
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(successCallback)
            .catch(errorCallback);

    } else if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true }, successCallback, errorCallback);

    } else if (Skylink) {

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

    } else {
        errorCallback('mediaDevices.getUserMedia and getUserMedia not supported in this browser.');
    }
}

const MicrophoneAccess = {
     getMicrophoneAccess
};

export default MicrophoneAccess;
