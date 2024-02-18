// player.js
const { createReadStream } = require('node:fs');
const { createAudioPlayer } = require('@discordjs/voice');
const { joinVoiceChannel, createAudioResource, getVoiceConnection, StreamType } = require('@discordjs/voice');
const youDown = require('../scripts/youtubeDownload'); 
const queueManager = require('../scripts/queueManager'); 
// Create a single AudioPlayer that will be used to play all songs
const audioPlayer = createAudioPlayer();

const playerState = {
    isPlaying: false
};


async function playNextSong(voiceChannel) {
    if (queueManager.isEmpty()) {
        playerState.isPlaying = false;
        return;
    }

    playerState.isPlaying = true;
    const nextSongUrl = queueManager.getNextSong().url;

    try {
        // Download the next song
        const downloadedFilePath = await youDown(nextSongUrl, 'output.ogg');

        const audioPlayer = createAudioPlayer();
        const audioResource = createAudioResource(createReadStream(downloadedFilePath, {
            inputType: StreamType.OggOpus,
        }));

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        // Subscribe the audio player to the connection
        connection.subscribe(audioPlayer);

        // Play the audio resource
        audioPlayer.play(audioResource);

        // When the song ends, play the next song
        audioPlayer.on('idle', () => {
            playNextSong(voiceChannel);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { audioPlayer, playNextSong, playerState};