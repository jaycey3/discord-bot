const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Catch items from the sea to sell for money!'),
  async execute(interaction) {
    const { getItem, addItem } = require('../sql/itemQueries');

    const items = {
      old_boot: { id: 1, chance: 10 }, // 10% kans
      blowfish: { id: 2, chance: 15 }, // 15% kans
      shrimp: { id: 3, chance: 20 }, // 20% kans
      fish: { id: 4, chance: 25 }, // 25% kans
      tropical_fish: { id: 5, chance: 15 }, // 15% kans
      crab: { id: 6, chance: 10 }, // 10% kans
      lobster: { id: 7, chance: 5 }, // 5% kans
    };

    let totalChance = 0;
    for (const key in items) {
      totalChance += items[key].chance;
    }

    let randomNumber = Math.floor(Math.random() * totalChance);

    let selectedItem;
    for (const key in items) {
      if (randomNumber < items[key].chance) {
        selectedItem = items[key];
        break;
      } else {
        randomNumber -= items[key].chance;
      }
    }

    const item = await getItem(selectedItem.id);

    const embed = new EmbedBuilder()
      .setTitle('🎣 Fishing')
      .setColor('#2C2F33')
      .setDescription(`You caught a **${item.name}**!
    The item has been added to your \`/inventory\`.`)
      .setFooter({ text: 'You can sell your fish for money using /sell.' })

    await interaction.reply({ embeds: [embed] });
    await addItem(interaction.user.id, selectedItem.id, 1);
  },
};