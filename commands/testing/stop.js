// pause.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { audioPlayer } = require('../scripts/player.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        // Pause the current song
        audioPlayer.pause();

        await interaction.reply('Paused the current song.');
    },
};