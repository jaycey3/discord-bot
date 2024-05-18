const connection = require('../index');

async function createUserSettings(user_id) {
    const newUserSettings = {
        user_id: user_id,
        level_color: 0,
        custom_color: 'none',
        level_background: 0,
    };

    try {
        const result = await connection.connection.execute(`INSERT INTO user_settings (user_id, level_color, custom_color, level_background) VALUES (?, ?, ?, ?)`, [newUserSettings.user_id, newUserSettings.level_color, newUserSettings.custom_color, newUserSettings.level_background]);
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

async function getSetting(setting_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM settings WHERE id = ?', [setting_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('Setting not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch setting:', err);
        throw err;
    }
}

async function getUserSetting(user_id, setting_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM unlocked_settings WHERE user_id = ? AND setting_id = ?', [user_id, setting_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('User setting not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch user setting:', err);
        throw err;
    }
}

async function unlockSetting(user_id, setting_id) {
    try {
        const setting = await getUserSetting(user_id, setting_id);
        if (!setting) {
            connection.connection.execute('INSERT INTO unlocked_settings (user_id, setting_id) VALUES (?, ?)', [user_id, setting_id]);
            console.log('Setting unlocked for user', user_id);
        } else {
            console.log('Setting already unlocked for user', user_id);
        }
    } catch (err) {
        console.error('Error while trying to unlock setting:', err);
        throw err;
    }
}

async function getAllSettings() {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM settings');

        return rows;
    } catch (err) {
        console.error('Error while trying to fetch settings:', err);
        throw err;
    }
}

async function getAllUnlockedSettings(user_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM unlocked_settings WHERE user_id = ?', [user_id]);

        return rows;
    } catch (err) {
        console.error('Error while trying to fetch inventory:', err);
        throw err;
    }
}

async function updateSetting(user_id, setting, value) {
    try {
        await connection.connection.execute(`UPDATE user_settings SET ${setting} = ? WHERE user_id = ?`, [value, user_id]);
    } catch (err) {
        console.error('Error while trying to update setting:', err);
        throw err;
    }

}

module.exports = {
    createUserSettings,
    getUserSettings,
    getSetting,
    getUserSetting,
    unlockSetting,
    getAllSettings,
    getAllUnlockedSettings,
    updateSetting,
};