const ytdl = require('ytdl-core');
const fs = require('fs');
console.log("here");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
// Set the path to the FFmpeg executable
ffmpeg.setFfmpegPath('/home/simoncbeer1/Desktop/Projects/DiscordBot/node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

const downloadAudio = async (youtubeUrlOrId, outputFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const info = await ytdl.getInfo(youtubeUrlOrId);

      const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

      if (format) {
        const videoTitle = info.videoDetails.title;
        console.log(`Downloading: ${videoTitle}`);

        const oggOutputFilePath = outputFilePath.replace(/\.[^.]+$/, '.ogg'); // Change the output file extension to .ogg
        const stream = ytdl.downloadFromInfo(info, { format: format });

        // Convert the downloaded audio to Ogg format using ffmpeg
        ffmpeg(stream)
          .audioCodec('libvorbis') // Use 'libvorbis' for Ogg format
          .format('ogg') // Set the output format to Ogg
          .on('end', () => {
            console.log(`Downloaded and converted to Ogg: ${oggOutputFilePath}`);
            resolve(oggOutputFilePath);
          })
          .on('error', (err) => {
            console.error('Error during conversion:', err);
            reject(err);
          })
          .save(oggOutputFilePath);
      } else {
        console.error('No audio formats found for the provided URL/ID.');
        reject(new Error('No audio formats found'));
      }
    } catch (error) {
      console.error('Error:', error);
      reject(error);
    }
  });
};
module.exports = downloadAudio;
