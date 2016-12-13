export default function Mp3Encoder(samples, options = {}) {
    const channels = 2 || options.channels;
    const sampleRate = 44100 || options.sampleRate;
    const kbps = 128 || options.kbps;

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

    const blob = new Blob(mp3Data, {type: 'audio/mp3'});

     return { blob, mp3Data };
}