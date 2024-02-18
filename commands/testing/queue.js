// queue.js
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const queueManager = require('../scripts/queueManager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current song queue.'),
    async execute(interaction) {
        const queue = queueManager.getQueue();

        if (queue.length === 0) {
            await interaction.reply('The song queue is currently empty.');
            return;
        }

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Song Queue')  
        queue.forEach((song, index) => {
            embed.addFields({ name: `#${index + 1}: ${song.title}`, value: `[Link](${song.url})`});
        });

        await interaction.reply({ embeds: [embed] });
    },
};