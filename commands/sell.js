const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell items from your inventory.')
    .addIntegerOption(option => 
        option
        .setName('id')
        .setDescription('The ID of the item you want to sell.')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(7)
    )
    .addIntegerOption(option => 
        option
        .setName('amount')
        .setDescription('The amount of items you want to sell.')
        .setRequired(false)
    ),
  async execute(interaction) {
    const { getUserItem, getItem, addItem, addBalance } = require('../index');
    const item_id = interaction.options.getInteger('id');
    const amount = interaction.options.getInteger('amount') || 1;

    const userItem = await getUserItem(interaction.user.id, item_id);
    const item = await getItem(item_id);
    const sellValue = item.sell_value * amount;

    if (!userItem) {
        return interaction.reply({ content: `⚠️ **You do not have a ${item.name} in your inventory.**`, ephemeral: true });
    }

    if (userItem.amount < amount) {
        return interaction.reply({ content: `⚠️ **You do not have \`${amount}\` ${item.name}. You only have \`${userItem.amount}\` ${item.name}**`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
    .setTitle(`💰 Item sold`)
    .setColor('#2C2F33')
    .setDescription(`You sold \`${amount}\` ${item.name} for \`${item.sell_value}\` 🪙.`)
    .setColor('#2C2F33')

    await addItem(interaction.user.id, item_id, -amount);
    await addBalance(interaction.user.id, sellValue);
    await interaction.reply({ embeds: [embed] });
  },
};