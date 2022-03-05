const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const config = require('./resources/config.json');
const fs = require('fs');

var videoNames = fs.readdirSync('./videos/').map(e=>'./videos/'+e).sort((x,y) => x.length - y.length);
var mergedVideo = ffmpeg();
videoNames.forEach(function(videoName){
    mergedVideo = mergedVideo.addInput(videoName);
});

mergedVideo
.mergeToFile('./resources/video.mp4', './')
.on('error', function(err) {
    console.log('Error ' + err.message);
})
.on('end', function() {
    ffmpeg()
    .addInput('./resources/video.mp4')
    .addInput(config.song)
    .saveToFile('./rvidyu.mp4', "./")
    .on('end', _=>console.log("ⵉⴽⵎⵎⵍ!"))
});


