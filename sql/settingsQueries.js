const connection = require('../index');

async function createUserSettings(user_id) {
    const newUser = {
        user_id: user_id,
        level_color: 0,
        custom_color: 'none',
        level_background: 0,
    };

    try {
        const result = await connection.connection.execute(`INSERT INTO user_settings (user_id, level_color, custom_color, level_background) VALUES (?, ?, ?, ?)`, [newUser.user_id, newUser.level_color, newUser.custom_color, newUser.level_background]);
        console.log('Added new user settings', result);
    } catch (err) {
        console.error('Error while trying to add user settings:', err);
    }
}

async function getUserSettings(user_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM user_settings WHERE user_id = ?', [user_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('User settings not found, creating a new one');
            await createUserSettings(user_id);
            // Return a default user object with default values
            return {
                user_id: user_id,
                level_color: 0,
                custom_color: 'none',
                level_background: 0,
            };
        }
    } catch (err) {
        console.error('Error while trying to fetch user settings:', err);
        throw err;
    }
}

async function getUnlockable(unlockable_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM unlockables WHERE id = ?', [unlockable_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('Unlockable not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch item:', err);
        throw err;
    }
}

async function getUserSetting(user_id, unlockable_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM settings WHERE user_id = ? AND unlockable_id = ?', [user_id, unlockable_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('User setting not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch user item:', err);
        throw err;
    }
}

async function addSetting(user_id, unlockable_id) {
    try {
        const item = await getUserItem(user_id, item_id);
        if (!item) {
            connection.connection.execute('INSERT INTO inventory (user_id, item_id, amount) VALUES (?, ?, ?)', [user_id, item_id, amount]);
            console.log('Item added to inventory for user', user_id);
        } else {
            const updatedAmount = item.amount + amount;
            if (updatedAmount <= 0) {
                connection.execute('DELETE FROM inventory WHERE user_id = ? AND item_id = ?', [user_id, item_id]);
                console.log('Item removed from inventory for user', user_id);
            } else {
                connection.execute('UPDATE inventory SET amount = ? WHERE user_id = ? AND item_id = ?', [updatedAmount, user_id, item_id]);
                console.log('Inventory updated for user', user_id);
            }
        }
    } catch (err) {
        console.error('Error while trying to update balance:', err);
        throw err;
    }
}

async function getAllUnlockables() {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM unlockables');

        return rows;
    } catch (err) {
        console.error('Error while trying to fetch jobs:', err);
        throw err;
    }
}

module.exports = {
    createUserSettings,
    getUserSettings,
    getUnlockable,
    getUserSetting,
    addSetting,
    getAllUnlockables,
};