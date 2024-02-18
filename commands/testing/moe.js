const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moe')
        .setDescription('Replies with what moe is!'),
    async execute(interaction) {
        await interaction.reply('Is cool!');
    }
}