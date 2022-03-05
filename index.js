const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const config = require('./resources/config.json');
const fs = require('fs');

let iwaliwntxt = fs.readFileSync('./resources/iwaliwn.txt').toString();
let iwaliwn = {};
v=0;for(awal of iwaliwntxt.split("\n")){
    if(awal == "EOF")
    break;
    if(v%3 == 0)
        iwaliwn[awal.replace(/\r/g, "")] = {"en": iwaliwntxt.split('\n')[v+2].replace(/\r/g,""), "tm": iwaliwntxt.split('\n')[v+1].replace(/\r/g,"")};
    v++;
}
const { createCanvas, loadImage } = require("canvas");
const sizeOf = require('image-size');
const dartist = sizeOf('./resources/artist.png');

async function main(){
    let i=0;
    for (const awal in iwaliwn) {
        const width = 1280;
        const height = 720;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.fillStyle = config.background;
        context.fillRect(0, 0, width, height);   
        
        context.font = "37pt sans-serif, 'Times New Roman'";
        context.fillStyle = "#000";
        context.fillText(iwaliwn[awal].en, 90, 480);
        context.font = "37pt sans-serif, 'Ebrima'";
        context.fillText(tfngh(iwaliwn[awal].tm), 100, 250);

        const image = await loadImage("./resources/artist.png");
        context.drawImage(image, width-dartist.width-20, height-dartist.height-20);

        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(`./images/im${i}.png`, buffer);
        i++;
    }
}

const tfngh = text => {
    const tifinagh = {"gh":"ⵖ","a":"ⴰ","b":"ⴱ","c":"ⵛ","d":"ⴷ","e":"","f":"ⴼ","g":"ⴳ","h":"ⵀ","i":"ⵉ","j":"ⵊ","k":"ⴽ","l":"ⵍ","m":"ⵎ","n":"ⵏ","o":"ⵓ","p":"ⵒ","q":"ⵇ","r":"ⵔ","s":"ⵙ","t":"ⵜ","u":"ⵓ","v":"ⵯ","w":"ⵡ","x":"ⵅ","y":"ⵢ","z":"ⵣ","3":"ⵄ","7":"ⵃ","R":"ⵟ","Z":"ⵥ","T":"ⵟ","D":"ⴹ"};
    for(const t in tifinagh){
        text = text.replace(new RegExp(t, "g"), tifinagh[t]);
    }
    return text;
}

function nth(obj, n){
    a=[];
    for(const awal in obj){
        tmp = {};
        tmp[awal] = obj[awal];
        a.push(tmp);
    }
    return a[n];
}

const key = e=>{return Object.keys(e)[0]};
const val = e=>{return Object.values(e)[0]};

async function conv(){
    const images = fs.readdirSync('./images/').map(e=>__dirname+'images/'+e);
    const audio = __dirname+ '/takndawt.mp3';
    let duration = [];
    for(let i=0;i<images.length;i++){
        const start = key(nth(iwaliwn, i)).split("-")[0];
        const end = key(nth(iwaliwn, i)).split("-")[1];
        const sseconds = Number(start.split(":")[1]) + Number(start.split(":")[0])*60;
        const eseconds = Number(end.split(":")[1]) + Number(end.split(":")[0])*60;
        const seconds = eseconds - sseconds;
        duration[i] = seconds;
    }
    for(let i=0;i<images.length;i++){
        var proc = await ffmpeg(`./images/im${i}.png`)
        .loop(duration[i])
        .fps(30)
        .on('end', function(){console.log(`ikml tawuri ns gh lvideo ${i}`);})
        .on('error', function(err) {console.log('an error bhappened: ' + err.message);})
        .save(`./videos/vi${i}.m4v`);
    };
}

main().then(conv)