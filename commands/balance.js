const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your own or someone else\'s balance.')
    .addUserOption(option => 
        option.setName('user')
        .setDescription('The user you want to check the balance of.')
        .setRequired(false)),
  async execute(interaction) {
    const { getBalance } = require('../index');
    const target = interaction.options.getUser('user') ?? interaction.user;
    const balance = await getBalance(target.id).toLocaleString();

    const embed = new EmbedBuilder()
    .setTitle('💰 Balance')
    .setColor('#2C2F33')
    .setDescription(`**${target.toString()}** currently has \`${balance}\` 🪙`)
    .setThumbnail(target.avatarURL({ dynamic: true }))

    return interaction.reply({ embeds: [embed] });
  },
};