const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View or change your settings.'),
  async execute(interaction) {
    const { getUserSettings, getAllUnlockedSettings, getSetting, updateSetting } = require('../sql/settingsQueries');
    const user = interaction.user;
    let { level_color, level_background, custom_color } = await getUserSettings(user.id);

    let levelColor;
    let levelBackground;
    let customColor;

    if (level_color === 0) {
      levelColor = 'Default';
    } else if (level_color === 9){
      levelColor = '🎨 Custom';
    } else {
      let color = await getSetting(level_color);
      levelColor = color.name;
    }
    if (level_background === 0) {
      levelBackground = 'Default';
    }

    if (custom_color === 'none') {
      customColor = 'None';
    } else {
      customColor = custom_color;
    }

    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('level_color')
          .setLabel('Change Level Color')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🎨')
      );

    const embed = new EmbedBuilder()
      .setTitle('🛠️ Settings')
      .setDescription('Here you can view and change your settings. To change a setting, use the buttons below this embed.')
      .setColor('#2C2F33')
      .addFields(
        { name: '🎨 Level color', value: `\`${levelColor}\``, inline: true },
        { name: '🖼️ Level background', value: `\`${levelBackground}\``, inline: true }
      );

    const response = await interaction.reply({ embeds: [embed], components: [row] });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
      const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 3600_000 });

      if (selection.customId === 'level_color') {
        const select = new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Please select a color.');

        if (level_color !== 0) {
          select.addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('🔄 Default')
              .setValue('0')
          );
        }

        let unlockedSettings = await getAllUnlockedSettings(user.id);

        let unlockedColors = [];

        for (let setting of unlockedSettings) {
          let color = await getSetting(setting.setting_id);

          if (color.type === 'level_color') {
            unlockedColors.push(color);
          }
        }

        if (unlockedColors.length === 0) {
          selection.reply({ content: '⚠️ **You have no colors unlocked. Please unlock a color first using `/unlock`.**', ephemeral: true });
          interaction.editReply({ components: [] });
          return;
        }

        for (let color of unlockedColors) {
          const { id, name } = color;
          if (id === level_color) continue;

          select.addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel(name)
              .setValue(id.toString())
          );
        }

        const colorSelectEmbed = new EmbedBuilder()
          .setTitle('🎨 Select a color')
          .setDescription('Please select the color that you want to show on your level card using the select menu below.')
          .addFields(
            { name: '🌈 Custom color', value: `\`${customColor}\`` }
          )
          .setColor('#2C2F33');

        const selectMenu = new ActionRowBuilder()
          .addComponents(select);

        const customButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('custom_color')
              .setLabel('Change Custom Color')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🌈')
          );

        const colorSelection = await selection.update({ embeds: [colorSelectEmbed], components: [selectMenu, customButton] });

        const colorCollectorFilter = i => i.user.id === interaction.user.id;
        try {
          const selectedColor = await colorSelection.awaitMessageComponent({ filter: colorCollectorFilter, time: 180_000 });

          if (selectedColor.customId === 'custom_color') {
            const modal = new ModalBuilder()
              .setCustomId('customColorModal')
              .setTitle('Enter Custom Color');

            const colorInput = new TextInputBuilder()
              .setCustomId('hexCode')
              .setLabel('Hex Code')
              .setPlaceholder('#FFFFFF')
              .setStyle(TextInputStyle.Short)
              .setMaxLength(7)
              .setMinLength(7);

            const firstActionRow = new ActionRowBuilder().addComponents(colorInput);

            modal.addComponents(firstActionRow);

            await selectedColor.showModal(modal);

            const modalSubmit = await selectedColor.awaitModalSubmit({ filter: colorCollectorFilter, time: 180_000 });
            const hexCode = modalSubmit.fields.getTextInputValue('hexCode');

            if (/^#[0-9A-F]{6}$/i.test(hexCode)) {
              await updateSetting(user.id, 'custom_color', hexCode);

              const updatedSettings = await getUserSettings(user.id);
              customColor = updatedSettings.custom_color;

              const updatedEmbed = new EmbedBuilder()
                .setTitle('🛠️ Settings')
                .setDescription('Here you can view and change your settings. To change a setting, use the buttons below this embed.')
                .setColor('#2C2F33')
                .addFields(
                  { name: '🎨 Level color', value: `\`${levelColor}\``, inline: true },
                  { name: '🖼️ Level background', value: `\`${levelBackground}\``, inline: true },
                  { name: '🌈 Custom color', value: `\`${customColor}\``, inline: true }
                );

              await modalSubmit.update({ content: '✅ **Custom color has been updated!**', embeds: [updatedEmbed], components: [] });
            } else {
              await modalSubmit.update({ content: '⚠️ **Invalid hex code. Please try again.**', embeds: [embed], components: [] });
            }
          } else {
            if (selectedColor.values[0] == 0) {
              levelColor = 'Default';
            } else if (selectedColor.values[0] == 9){
              levelColor = '🎨 Custom';
            } else {
              let color = await getSetting(selectedColor.values[0]);
              levelColor = color.name;
            }
            
            const embed = new EmbedBuilder()
              .setTitle('🛠️ Settings')
              .setDescription('Here you can view and change your settings. To change a setting, use the buttons below this embed.')
              .setColor('#2C2F33')
              .addFields(
                { name: '🎨 Level color', value: `\`${levelColor}\``, inline: true },
                { name: '🖼️ Level background', value: `\`${levelBackground}\``, inline: true }
              );

            await updateSetting(user.id, 'level_color', selectedColor.values[0]);
            await selection.editReply({ content: '✅ **Level color has been updated!**', embeds: [embed], components: [] });
          }
        } catch (error) {
          console.log(error);
          selection.editReply({ embeds: [embed], components: [] });
        }

      } else if (selection.customId === 'level_background') {
        // Handle level background change
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({ embeds: [embed], components: [] });
    }
  },
};
