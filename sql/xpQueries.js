const { connection, client } = require('../index');
const { getUser } = require('./userQueries');

async function getLevels() {
    try {
      const [rows] = await connection.execute('SELECT * FROM levels');
      //console.log('Rows:', rows); // Use a comma to log the array correctly
      return rows;
    } catch (err) {
      console.error('Error while trying to fetch inventory:', err);
      throw err;
    }
  }

async function addXP(user_id, amount, channel) {
    try {
        const user = await getUser(user_id);
        if (user) {
            const updatedExperience = user.xp + amount;
            await connection.connection.execute('UPDATE users SET xp = ? WHERE user_id = ?', [updatedExperience, user_id]);
            console.log('Experience updated for user', user_id);

            const levels = await getLevels();

            const currentLevel = levels.findIndex(level => level.total_xp > user.xp);
            const newLevel = levels.findIndex(level => level.total_xp > updatedExperience);

            if (newLevel > currentLevel) {
                const levelChannel = client.channels.cache.get(channel);
                levelChannel.send(`🎉 **Congratulations <@${user_id}>!** You have reached level **${newLevel}**!`);
            }
        }
    } catch (err) {
        console.error('Error while trying to update experience:', err);
        throw err;
    }
}

module.exports = {
    addXP,
    getLevels,
};