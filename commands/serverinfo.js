const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays some information about this server.'),
  async execute(interaction) {
    const boost = {
      0 : 'No boost level',
      1 : 'Level 1',
      2 : 'Level 2',
      3 : 'Level 3',
    };

    const verifLevels = {
      0 : 'None',
      1 : 'Low',
      2 : 'Medium',
      3 : 'High',
      4 : 'Highest',
    };

    const serverEmbed = new EmbedBuilder()
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#2C2F33')
      .addFields(
        { name: 'Server Name', value: interaction.guild.name, inline: true },
        { name: 'Owner', value: `<@${interaction.guild.ownerId}>`, inline: true },
        { name: 'Boost Level', value: boost[interaction.guild.premiumTier], inline: true },
        { name: 'Members', value: interaction.guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: interaction.guild.channels.cache.filter(c => c.type !== 'category').size.toString(), inline: true },
        { name: 'Verification Level', value: verifLevels[interaction.guild.verificationLevel], inline: true },
        { name: 'Server ID', value: interaction.guild.id, inline: true },
        { name: 'Roles', value: interaction.guild.roles.cache.map(r => `${r.toString()}`).join(', ') },
        { name: 'Created At', value: moment.utc(interaction.guild.createdAt).format('dddd MMMM Do YYYY, HH:mm') },
      )
      .setImage(interaction.guild.bannerURL({ dynamic: true, size: 256 }))
      .setTimestamp();

    await interaction.reply({ embeds: [serverEmbed] });
  },
};