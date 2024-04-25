const { SlashCommandBuilder, EmbedBuilder, codeBlock, Embed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the richest users.'),
  async execute(interaction) {
    const { currency, client } = require('../index');

    const positionEmoji = {
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
        10: '🔟'
    };

    const users = currency.sort((a, b) => b.balance - a.balance)
    .filter(user => client.users.cache.has(user.user_id))
    .first(10);

    const embed = new EmbedBuilder()
    .setTitle('🏆 Leaderboard')
    .setColor('#2C2F33')

    if (users.length > 0) {
      const description = users.map((user, position) => `${positionEmoji[position + 1]} **${(client.users.cache.get(user.user_id).displayName)}** \`${user.balance.toLocaleString()}\` 🪙`).join('\n');
      embed.setDescription(description);
    } else {
      embed.setDescription('❌ No users found to display on the leaderboard.');
    }

    interaction.reply({ embeds: [embed] });
  },
};