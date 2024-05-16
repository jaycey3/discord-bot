const connection = require('../index');
const mysql = require('mysql2/promise');

async function createUser(user_id) {
    const newUser = {
        user_id: user_id,
        balance: 0,
        job_id: 0,
        work_xp: 0,
        work_streak: 0,
        last_work_date: 0,
        xp: 0
    };

    try {
        const result = await connection.connection.execute(`INSERT INTO users (user_id, balance, job_id, work_xp) VALUES (?, ?, ?, ?)`, [newUser.user_id, newUser.balance, newUser.job_id, newUser.work_xp]);
        console.log('Added a new user', result);
    } catch (err) {
        console.error('Error while trying to add user:', err);
    }
}

async function getUser(user_id) {
    try {
        const result = await connection.connection.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
        if (result && result.length > 0) {
            return result[0];
        } else {
            console.log('User not found, creating a new one');
            await createUser(user_id);
            // Return a default user object with default values
            return {
                user_id: user_id,
                balance: 0,
                job_id: 0,
                work_xp: 0,
                work_streak: 0,
                last_work_date: 0,
                xp: 0
            };
        }
    } catch (err) {
        console.error('Error while trying to fetch user:', err);
        throw err;
    }
}

module.exports = {
    createUser,
    getUser,
};