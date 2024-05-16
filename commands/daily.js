const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 86400,
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily moneys.'),
  async execute(interaction) {
    const { addBalance } = require('../sql/economyQueries');
    const daily = 5000;

    const embed = new EmbedBuilder()
    .setTitle(`🎁 Here is your daily treat ${interaction.user.displayName}!`)
    .setColor('#2C2F33')
    .setDescription(`Added \`${daily.toLocaleString()}\` 🪙 to your balance.`)

    addBalance(interaction.user.id, daily);
    interaction.reply({ embeds: [embed] });
  },
};