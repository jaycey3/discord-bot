const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const YouTube = require('youtube-sr').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Search for a video on youtube.com')
    .addStringOption(option => option.setName('keywords').setDescription('The keywords you want to search for.').setRequired(true)),
  async execute(interaction) {
    const keywords = interaction.options.getString('keywords');
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?$/;

    const isURL = urlRegex.test(keywords);
    let video;

    if (isURL) {
      video = await YouTube.getVideo(keywords);
    } else {
      video = await YouTube.searchOne(keywords);
    }

    const youtubeEmbed = new EmbedBuilder()
      .setThumbnail(video.thumbnail.url)
      .setColor('#ff0000')
      .setTitle(video.title)
      .setURL(video.url)
      .addFields(
        { name: 'Views', value: video.views.toLocaleString(), inline: true },
        { name: 'Duration', value: video.durationFormatted, inline: true },
        { name: 'Uploaded', value: video.uploadedAt, inline: true },
      )
      .setFooter({ text: video.channel.name })
      .setTimestamp();

    await interaction.reply({ embeds: [youtubeEmbed] });
  },
};