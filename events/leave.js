const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'guildMemberRemove',
  once: false,
  execute(member) {
    const memberLogChannel = member.guild.channels.cache.get('617021925712986122');

    const leaveEmbed = new EmbedBuilder()
      .setAuthor({ name: `${member.user.tag} (${member.user.id})`, iconURL: member.user.avatarURL({ dynamic: true }) })
      .setThumbnail(member.user.avatarURL({ dynamic: true }))
      .setColor('#23272A')
      .setDescription(`${member.toString()} just left **${member.guild.name}**!`)
      .addFields({ name: 'Joined', value: moment.utc(member.joinedAt).format('dddd MMMM Do YYYY, HH:mm') })
      .setFooter({ text: `Member left • Members: ${member.guild.memberCount}` })
      .setTimestamp();

    memberLogChannel.send({ embeds: [leaveEmbed] });
  },
};