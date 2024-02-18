// resume.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { audioPlayer } = require('../scripts/player.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current song.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        // Resume the current song
        audioPlayer.unpause();

        await interaction.reply('Resumed the current song.');
    },
};