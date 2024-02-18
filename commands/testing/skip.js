// skip.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { audioPlayer, playNextSong } = require('../scripts/player.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        // Stop the current song
        audioPlayer.stop(true);

        // Start playing the next song
        playNextSong(voiceChannel);

        await interaction.reply('Skipped to the next song.');
    },
};