const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays information about a specified user.')
    .addUserOption(option => option.setName('user').setDescription('The user you want to see information about.').setRequired(false)),
  async execute(interaction) {
    const optionMember = interaction.options.getMember('user');
    const infoMember = optionMember || interaction.member;

    const status = {
      'online': '🟢 Online',
      'offline': '⚫ Offline',
      'idle': '🟠 Idle',
      'dnd': '🔴 DND',
    };

    const actvityTypes = {
      0 : 'Playing',
      1 : 'Streaming',
      2 : 'Listening to',
      3 : 'Watching',
      4 : 'Custom status',
      5 : 'Competing',
      null : 'No Activity',
    };

    const activityType = infoMember.presence.status === 'offline' || infoMember.presence.activities.length === 0 ? 'Activity' : actvityTypes[infoMember.presence.activities[0].type];
    const activityName = infoMember.presence.status === 'offline' || infoMember.presence.activities.length === 0 ? 'None' : infoMember.presence.activities[0].name;

    const userEmbed = new EmbedBuilder()
      .setThumbnail(infoMember.user.avatarURL({ dynamic: true }))
      .setColor('#2C2F33')
      .addFields(
        { name: 'Username', value: infoMember.user.tag, inline: true },
        { name: 'Mention', value: infoMember.toString(), inline: true },
        { name: 'Display Name', value: infoMember.nickname !== null ? infoMember.nickname : infoMember.user.displayName, inline: true },
        { name: activityType, value: activityName, inline: true },
        { name: 'User ID', value: infoMember.user.id, inline: true },
        { name: 'Status', value: status[infoMember.presence.status], inline: true },
        { name: 'Roles', value: infoMember.roles.cache.map(r => `${r.toString()}`).join(', '), inline: false },
        { name: 'Joined At', value: moment.utc(infoMember.joinedAt).format('dddd MMMM Do YYYY, HH:mm') },
        { name: 'Created At', value: moment.utc(infoMember.user.createdAt).format('dddd MMMM Do YYYY, HH:mm') },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [userEmbed] });
  },
};