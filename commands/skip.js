const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { queues } = require('./play.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing song'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const queue = queues.get(guildId);

    if (!queue) {
        const skipEmbed = new EmbedBuilder()
        .setTitle('⚠️ There is nothing playing that I could skip for you.')
        .setColor('#2C2F33')
        
        return interaction.reply({ embeds: [skipEmbed] });
    }

    queue.player.stop();
    const skipEmbed = new EmbedBuilder()
    .setTitle('⏭️ Skipped the current song.')
    .setColor('#2C2F33')

    return interaction.reply({ embeds: [skipEmbed] });
  },
};