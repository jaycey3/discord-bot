const connection = require('../index');
const { getUser } = require('./userQueries');

async function addWorkStreak(user_id, amount) {
    try {
        const user = await getUser(user_id);
        if (user) {
            const updatedStreak = user.work_streak + amount;
            connection.connection.execute('UPDATE users SET work_streak = ? WHERE user_id = ?', [updatedStreak, user_id]);
            console.log('Work Streak updated for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to update work streak:', err);
        throw err;
    }
}

async function addWorkXP(user_id, amount) {
    try {
        const user = await getUser(user_id);
        if (user) {
            const updatedWorkXP = user.work_xp + amount;
            connection.connection.execute('UPDATE users SET work_xp = ? WHERE user_id = ?', [updatedWorkXP, user_id]);
            console.log('Work XP updated for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to update work XP:', err);
        throw err;
    }
}

async function resetWorkStreak(user_id) {
    try {
        const user = await getUser(user_id);
        if (user) {
            connection.connection.execute('UPDATE users SET work_streak = DEFAULT WHERE user_id = ?', [user_id]);
            console.log('Work streak reset.', user_id);
        }
    } catch (err) {
        console.error('Error while trying to reset work streak:', err);
        throw err;
    }
}
async function setLastWorkTime(user_id, lastWorkTime) {
    try {
        const user = await getUser(user_id);
        if (user) {
            connection.connection.execute('UPDATE users SET last_work_date = ? WHERE user_id = ?', [lastWorkTime, user_id]);
            console.log('Last work time updated for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to update last work time:', err);
        throw err;
    }
}

module.exports = {
    addWorkStreak,
    addWorkXP,
    resetWorkStreak,
    setLastWorkTime,
};