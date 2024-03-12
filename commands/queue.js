const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { queues } = require('./play.js');
const YouTube = require('youtube-sr').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const queue = queues.get(guildId);

    async function getSong(search) {
        let song = await YouTube.getVideo(search);
        return {
            url: song.url,
            title: song.title,
            thumbnailURL: song.thumbnail.url
        };
    }

    const result = await getSong(queue.songs[0])

    if (!queue || queue.songs.length === 0) {
        const queueEmptyEmbed = new EmbedBuilder()
        .setTitle(`🚫 Queue is empty.`)
        .setColor('#2C2F33')

      await interaction.reply({ embeds: [queueEmptyEmbed] });
      return;
    }

    const queueEmbed = new EmbedBuilder()
      .setAuthor({name: `Current Queue [${queue.songs.length}]`})
      .setColor('#2C2F33')
      .setThumbnail(result.thumbnailURL)
      .setTitle(`Next up ➡️ ${result.title}`);

    if (queue.songs.length > 1) {
        for (let i = 1; i < Math.min(queue.songs.length, 25); i++) {
            let result = await getSong(queue.songs[i])
            queueEmbed.addFields({ name: `#${i + 1}`, value: `[${result.title}](${result.url})` });
        }
    }

    await interaction.reply({ embeds: [queueEmbed] });
    
  },
};