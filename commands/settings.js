const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View or change your settings.'),
  async execute(interaction) {
    const { getUserSettings } = require('../sql/settingsQueries');
    const user = interaction.user;
    let { level_color: level_color, level_background: level_background, custom_color: customColor } = await getUserSettings(user.id);

    let levelColor;
    let levelBackground;

    if (level_color === 0) {
        levelColor = 'Default';
    }

    if (level_background === 0) {
        levelBackground = 'Default';
    }

    const embed = new EmbedBuilder()
    .setTitle('🛠️ Settings')
    .setDescription('Here you can view and change your settings. To change a setting, use the buttons below this embed.')
    .setColor('#2C2F33')
    .addFields(
        { name: 'Level Color', value: `${levelColor}`, inline: true },
        { name: 'Level Background', value: `${levelBackground}`, inline: true}
    )

    interaction.reply({ embeds: [embed] });
  },
};