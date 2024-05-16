const connection = require('../index');
const { getUser } = require('./userQueries');

async function addBalance(user_id, amount) {
    try {
        const user = await getUser(user_id);
        if (user) {
            const updatedBalance = user.balance + amount;
            connection.connection.execute('UPDATE users SET balance = ? WHERE user_id = ?', [updatedBalance, user_id]);
            console.log('Balance updated for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to update balance:', err);
        throw err;
    }
}

async function getTopUsers(limit) {
    try {
        const query = `SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT ?`;
        const [rows] = await connection.connection.execute(query, [limit]);

        return rows;
    } catch (error) {
        console.error('Error fetching top users:', error);
        throw error;
    }
}

module.exports = {
    addBalance,
    getTopUsers,
};