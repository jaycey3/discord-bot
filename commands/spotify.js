const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Displays a users\' current spotify activity.')
    .addUserOption(option => option.setName('user').setDescription('The user you want to display the spotify activity from.').setRequired(false)),
  async execute(interaction) {
    const optionMember = interaction.options.getMember('user');
    const spotifyMember = optionMember || interaction.member;

    if (spotifyMember.presence.status === 'offline' || spotifyMember.presence.activities.length === 0) {
      return interaction.reply({ content: '⚠️ **This user is not listening to Spotify at the moment!**', ephemeral: true });
    }

    const spotifyActivity = spotifyMember.presence.activities.find(a => a.name === 'Spotify');
    if (spotifyActivity) {
      const spotifyEmbed = new EmbedBuilder()
        .setThumbnail(`https://i.scdn.co/image/${spotifyActivity.assets.largeImage.slice(8)}`)
        .setAuthor({ name: `${spotifyMember.user.displayName} is currently listening to`, iconURL: 'https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png' })
        .setColor('#1DB954')
        .addFields(
          { name: 'Title', value: spotifyActivity.details, inline: true },
          { name: 'Artist(s)', value: spotifyActivity.state, inline: true },
          { name: 'Album', value: spotifyActivity.assets.largeText, inline: true },
        )
        .setFooter({ text: spotifyMember.user.displayName, iconURL: spotifyMember.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      await interaction.reply({ embeds: [spotifyEmbed] });
    }
  },
};