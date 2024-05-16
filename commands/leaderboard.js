const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the richest users.'),
  async execute(interaction) {
    const { client } = require('../index');
    const { getTopUsers } = require('../sql/economyQueries');

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

    const users = await getTopUsers(10);

    const embed = new EmbedBuilder()
    .setTitle('🏆 Leaderboard')
    .setColor('#2C2F33')

    let description = '';
    let position = 1;
    if (users.length > 0) {
      for (let user of users) {
        let displayName = client.users.cache.get(user.user_id).displayName;
  
        description += `${positionEmoji[position]} **${displayName}** \`${user.balance.toLocaleString()}\` 🪙\n`;
        position ++;
      }
    } else {
      description = '❌ No users found to display on the leaderboard.';
    }

    embed.setDescription(description);

    interaction.reply({ embeds: [embed] });
  },
};