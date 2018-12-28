var fs = require('fs');
var Ogg = require('./public/speex/ogg.min');
var fs = require('fs');
var fs = require('fs');

function decodeFile(bufSpx) {
    var stream, samples, st;
    var ogg, header, err;

    ogg = new Ogg(bufSpx, {file: true});
    ogg.demux();
    stream = ogg.bitstream();

    header = Speex.parseHeader(ogg.frames[0]);
    console.log(header);

    comment = new SpeexComment(ogg.frames[1]);
    console.log(comment.data);

    st = new Speex({
        quality: 8,
        mode: header.mode,
        rate: header.rate
    });

    samples = st.decode(stream, ogg.segments);

    var waveData = PCMData.encode({
        sampleRate: header.rate,
        channelCount: header.nb_channels,
        bytesPerSample: 2,
        data: samples
    });
    // return waveData
// array buffer holding audio data in wav codec
    var bufWav = Speex.util.str2ab(waveData);
// convert to a blob object
    var blob = new Blob([bufWav], {type: "audio/wav"});
// return a "blob://" url which can be used as a href anywhere
    return URL.createObjectURL(blob);
}

fs.readFile('./public/o8/us/abdomen__gb_1.spx', function (err, data) {
    if (err) {
        console.log(err);
    }
    decodeFile(data)
})