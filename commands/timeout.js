const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option => 
      option.setName('user')
      .setDescription('The user you want to timeout.')
      .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
      .setDescription('Reason for the timeout.')
      .setRequired(true))
      .addStringOption(option => 
        option.setName('duration')
        .setDescription('Duration of the timeout')
        .setRequired(true)
        .addChoices(
          { name : '1 Hour', value: 'one_hour' },
          { name: '3 Hours', value: 'three_hours' },
          { name: '6 Hours', value: 'six_hours'},
          { name: '12 Hours', value: 'twelve_hours' },
          { name: '1 Day', value: 'one_day' },
          { name: '3 Day', value: 'three_days' },
          { name: '5 Day', value: 'five_days' },
          { name: '7 Day', value: 'seven_days' },
        ))
      .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  async execute(interaction) {
    const timeoutMember = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const time = interaction.options.getString('duration');
    
    const duration = {
      'one_hour': 3600000,
      'three_hours': 10800000,
      'six_hours': 21600000,
      'twelve_hours' : 43200000,
      'one_day' : 86400000,
      'three_days' : 259200000,
      'five_days' : 432000000,
      'seven_days' : 604800000,
    };

    const timeoutEmbed = new EmbedBuilder()
    .setColor('#fff08c')
    .setDescription(`✅ Timed out **${timeoutMember.user.displayName} (${timeoutMember.user.username})**`);

    await timeoutMember.timeout(duration[time], reason);
    await interaction.reply({ embeds: [timeoutEmbed] });
  },
};