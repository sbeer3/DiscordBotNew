// remove.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const queueManager = require('../scripts/queueManager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue.')
        .addIntegerOption(option => 
            option.setName('number')
            .setDescription('Position of the song in the queue to remove')
            .setRequired(true)),
    async execute(interaction) {
        
        const position = interaction.options.getInteger('number');

        if (position < 1 || position > queueManager.getQueue().length) {
            await interaction.reply('Invalid position.');
            return;
        }

        const removedSong = queueManager.removeSong(position - 1); // Subtract 1 because arrays are 0-indexed

        await interaction.reply(`Removed ${removedSong.title} from the queue.`);
    },
};