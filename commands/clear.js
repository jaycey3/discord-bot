const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear out a certain amount of messages.')
    .addNumberOption(option => option.setName('amount').setDescription('The amount of messages you want to delete.').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getNumber('amount');

    await interaction.channel.bulkDelete(amount);
    await interaction.reply({ content: '🗑️ Cleared **' + amount + '** messages.' });
    await wait(5000);
    await interaction.deleteReply();
  },
};