const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell items from your inventory.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('item')
        .setDescription('Sell an item.')
        .addIntegerOption(option =>
          option.setName('id')
            .setDescription('The ID of the item you want to sell.')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('The amount of the item you want to sell.')
            .setRequired(false))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Sell all items in your inventory.')
    ),
  async execute(interaction) {
    const { getUserItem, getItem, addItem, getInventory } = require('../sql/itemQueries');
    const { addBalance } = require('../sql/economyQueries');

    if (interaction.options.getSubcommand() === 'item') {
      const item_id = interaction.options.getInteger('id');
      const amount = interaction.options.getInteger('amount') || 1;

      const userItem = await getUserItem(interaction.user.id, item_id);
      const item = await getItem(item_id);
      const sellValue = item.sell_value * amount;

      if (!userItem) {
        return interaction.reply({ content: `⚠️ **You do not have a ${item.name} in your inventory.**`, ephemeral: true });
      }

      if (userItem.amount < amount) {
        return interaction.reply({ content: `⚠️ **You do not have \`${amount}\` ${item.name}. You only have \`${userItem.amount}\` ${item.name}**.`, ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(`💰 Item sold`)
        .setColor('#2C2F33')
        .setDescription(`You sold ${amount} **${item.name}** for \`${sellValue}\` 🪙`)

      await addItem(interaction.user.id, item_id, -amount);
      await addBalance(interaction.user.id, sellValue);
      await interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === 'all') {
      const items = await getInventory(interaction.user.id);

      let itemTotal = 0;
      let total = 0;
      let itemList = '';

      if (items.length > 0) {
        for (let i of items) {
          const item = await getItem(i.item_id);
          const sellValue = item.sell_value * i.amount;

          itemList += `Sold \`${i.amount}\` **${item.name}** for \`${sellValue}\` 🪙\n`;
          itemTotal += i.amount;
          total += sellValue;
          await addItem(interaction.user.id, i.item_id, -i.amount);
          await addBalance(interaction.user.id, sellValue);
        }
      } else {
        return interaction.reply({ content: `⚠️ **You do not have any items to sell in your inventory.**`, ephemeral: true });
      }

      let description = `You sold \`${itemTotal}\` items for \`${total}\` 🪙\n\n` + itemList;

      const embed = new EmbedBuilder()
        .setTitle(`💰 Items sold`)
        .setColor('#2C2F33')
        .setDescription(description)

      await interaction.reply({ embeds: [embed] });
    }
  },
};