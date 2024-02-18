const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } = require('@discordjs/voice');
const searchYouTube = require('../scripts/youtubeSearch'); 
const { audioPlayer, playNextSong, playerState } = require('../scripts/player.js');
const queueManager = require('../scripts/queueManager'); 

const currentWorkingDirectory = process.cwd();

// Specify the relative path to your audio file from the current working directory
const audioFilePath = `/home/simoncbeer1/Desktop/Projects/DiscordBot/output.ogg`;

const maxResults = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Adds a song to the music queue!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name of the song to add')
                .setRequired(true)
        ),
        async execute(interaction) {
            const songName = interaction.options.getString('song');
            const voiceChannel = interaction.member.voice.channel;
            if (!playerState.isPlaying) {
                playNextSong(voiceChannel);
            }
            if (!voiceChannel) {
                await interaction.reply('You need to be in a voice channel to use this command.');
                return;
            }
        
            await interaction.deferReply();
            searchYouTube(songName, maxResults)
            .then(async videos => {
                const song = {
                    url: videos[0].url,
                    title: videos[0].title,
                    thumbnail: videos[0].img.high.url,
                    length: videos[0].length // assuming videos[0].length exists
                };
                const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Added ${song.title} to the queue!`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Video Url', value: song.url},
                )   
                await interaction.editReply({ embeds: [embed] });
        
                // Add the song to the queue
                queueManager.addSong(song);
        
                // If no song is currently playing, start playing the next song in the queue
                if (!playerState.isPlaying) {
                    playNextSong(voiceChannel);
                }
            })
            .catch(err => {
              console.error('Error:', err);
            });
        }
}
