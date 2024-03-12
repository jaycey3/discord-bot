const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('val')
    .setDescription('Check valorant stats')
    .addStringOption(option => 
        option.setName('name')
        .setDescription('The player name of the player you want to lookup')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('tag')
        .setDescription('The player tag of the player you want to lookup')
        .setRequired(true)),
  async execute(interaction) {
    const playerName = interaction.options.getString('name');
    const playerTag = interaction.options.getString('tag');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel('Profile')
        .setEmoji('👤')
        .setURL(`https://tracker.gg/valorant/profile/riot/${playerName}%23${playerTag}`)
        .setStyle(ButtonStyle.Link),

        new ButtonBuilder()
          .setLabel('Match History')
          .setEmoji('📃')
          .setURL(`https://tracker.gg/valorant/profile/riot/${playerName}%23${playerTag}/matches`)
          .setStyle(ButtonStyle.Link),
      );

      const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Agent Stats')
          .setEmoji('🎖️')
          .setURL(`https://tracker.gg/valorant/profile/riot/${playerName}%23${playerTag}/agents`)
          .setStyle(ButtonStyle.Link),
          
        new ButtonBuilder()
          .setLabel('Weapon Stats')
          .setEmoji('🔫')
          .setURL(`https://tracker.gg/valorant/profile/riot/${playerName}%23${playerTag}/weapons`)
          .setStyle(ButtonStyle.Link)
      );

    try {
      const embed = new EmbedBuilder()
      .setAuthor({ name: `Tracker.gg Valorant stats for ${playerName}#${playerTag}`, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/220px-Valorant_logo_-_pink_color_version.svg.png' })
      .setColor('#BD3944');
    
      await interaction.reply({ embeds: [embed], components: [row, row2] });
    } catch (e) {
        console.log(e);
        await interaction.reply(`⚠️ There was an error while fetching this player\'s profile (${e})`);
    }
  },
};