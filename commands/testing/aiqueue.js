// aiQueue.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } = require('@discordjs/voice');
const queueManager = require('../scripts/queueManager.js');
const generateSongQueue = require('../scripts/chatgpt.js');
const searchYouTube = require('../scripts/youtubeSearch'); 
const { audioPlayer, playNextSong, playerState } = require('../scripts/player.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('aiqueue')
        .setDescription('Add AI song suggestions to the queue.')
        .addStringOption(option => 
            option.setName('genre')
            .setDescription('Genre of the songs')
            .setRequired(true)),
    async execute(interaction) {
        // Defer the reply
        const voiceChannel = interaction.member.voice.channel;
        console.log(playerState.isPlaying);
        if (!playerState.isPlaying) {
            playNextSong(voiceChannel);
        }
        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }
    
        await interaction.deferReply();
        const mood = interaction.options.getString('genre');
        const songNames = await generateSongQueue(`Give me a ${mood} song queue`);

        for (const songName of songNames) {
            searchYouTube(songName, 1)
            .then(async videos => {
                const song = {
                    url: videos[0].url,
                    title: videos[0].title,
                    thumbnail: videos[0].img.high.url,
                    length: videos[0].length // assuming videos[0].length exists
                };
                queueManager.addSong(song);
            })
            .catch(err => {
              console.error('Error:', err);
            });
        }

        // Edit the deferred reply
        await interaction.editReply('Added AI song suggestions to the queue.');

        if (!playerState.isPlaying) {
            playNextSong(voiceChannel);
        }
    },
};