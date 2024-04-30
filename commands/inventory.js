const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Show your item inventory.'),
  async execute(interaction) {
    const { getInventory, getItem } = require('../index');

    const items = await getInventory(interaction.user.id);

    let description;

    const embed = new EmbedBuilder()
    .setTitle(`📦 ${interaction.user.displayName}'s Inventory`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setColor('#2C2F33')

    if (items.length > 0) {
        description = 'This is your inventory, use `/sell` to sell items.'
      for (let i of items) {
        const item = await getItem(i.item_id);

        embed.addFields(
            { name: `${item.name} [${i.amount}]`, value: `Sell ID: \`${item.id}\`\nSell value: \`${item.sell_value}\` 🪙` }
        );
      }
    } else {
      description = 'This is your inventory, use `/sell` to sell items.\n\n❌ Your inventory is empty.';
    }

    embed.setDescription(description)
    await interaction.reply({ embeds: [embed] });
  },
};