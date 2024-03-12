const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option => 
      option.setName('user')
      .setDescription('The user you want to kick.')
      .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
      .setDescription('Reason for the kick.')
      .setRequired(true))
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
  async execute(interaction) {
    const kickMember = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    const kickEmbed = new EmbedBuilder()
    .setColor('#ffaf4f')
    .setDescription(`✅ Kicked **${kickMember.user.displayName} (${kickMember.user.username})**`);

    await kickMember.kick({ reason: reason });
    await interaction.reply({ embeds: [kickEmbed] });
  },
};