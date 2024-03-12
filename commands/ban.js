const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option => 
      option.setName('user')
      .setDescription('The user you want to ban.')
      .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
      .setDescription('Reason for the ban.')
      .setRequired(true))
    .addStringOption(option => 
      option.setName('messages')
      .setDescription('Period of time to delete messages from this user.')
      .setRequired(true)
      .addChoices(
        { name: 'None', value: 'none' },
        { name: '12 Hours', value: 'twelve_hours' },
        { name: '1 Day', value: 'one_day' },
        { name: '3 Day', value: 'three_days' },
        { name: '5 Day', value: 'five_days' },
        { name: '7 Day', value: 'seven_days' },
      ))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  async execute(interaction) {
    const banMember = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const messages = interaction.options.getString('days');

    const time = {
      'none' : 0,
      'twelve_hours' : 43200,
      'one_day' : 86400,
      'three_days' : 259200,
      'five_days' : 432000,
      'seven_days' : 604800,
    };

    const banEmbed = new EmbedBuilder()
    .setColor('#ff5e5e')
    .setDescription(`✅ Banned **${banMember.user.displayName} (${banMember.user.username})**`);

    await banMember.ban({ deleteMessageSeconds: time[messages], reason: reason });
    await interaction.reply({ embeds: [banEmbed] });
  },
};