const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the richest users.')
    .addSubcommand(subcommand =>
      subcommand
      .setName('balance')
      .setDescription('Shows the richest users by balance.')
    )
    .addSubcommand(subcommand =>
      subcommand
      .setName('level')
      .setDescription('Shows the users with the highest level.')
    ),
  async execute(interaction) {
    const { client } = require('../index');
    const { getTopEconomyUsers } = require('../sql/economyQueries');
    const { getLevels, getTopLevelUsers } = require('../sql/xpQueries');

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

    if (interaction.options.getSubcommand() === 'balance') {
      const users = await getTopEconomyUsers(10);

      const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard')
      .setColor('#2C2F33')
  
      let description = '';
      let position = 1;
      if (users.length > 0) {
        for (let user of users) {
          let displayName = client.users.cache.get(user.user_id).displayName;

          if (user.balance == 0) {
            break;
          }
    
          description += `${positionEmoji[position]} **${displayName}** \`${user.balance.toLocaleString()}\` 🪙\n`;
          position ++;
        }
      } else {
        description = '❌ No users found to display on the leaderboard.';
      }
  
      embed.setDescription(description);
  
      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === 'level') {
      const users = await getTopLevelUsers(10);
      const levels = await getLevels();

      const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard')
      .setColor('#2C2F33')
  
      let description = '';
      let position = 1;
      if (users.length > 0) {
        for (let user of users) {
          let displayName = client.users.cache.get(user.user_id).displayName;
          let xp = user.xp;

          if (xp == 0) {
            break;
          }

          let userLevel = 0;
          for (let i = 0; i < levels.length; i++) {
            if (xp >= levels[i].total_xp) {
              userLevel = i + 1;
            } else {
              break;
            }
          }
    
          description += `${positionEmoji[position]} **${displayName}** \`Level ${userLevel} | ${xp.toLocaleString()} XP\`\n`;
          position ++;
        }
      } else {
        description = '❌ No users found to display on the leaderboard.';
      }
  
      embed.setDescription(description);
  
      interaction.reply({ embeds: [embed] });
    }
  },
};