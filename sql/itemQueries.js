const connection = require('../index');

async function getItem(item_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM items WHERE id = ?', [item_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('Item not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch item:', err);
        throw err;
    }
}

async function getUserItem(user_id, item_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?', [user_id, item_id]);
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            console.log('User item not found.');
            return;
        }
    } catch (err) {
        console.error('Error while trying to fetch user item:', err);
        throw err;
    }
}

async function addItem(user_id, item_id, amount) {
    try {
        const item = await getUserItem(user_id, item_id);
        if (!item) {
            connection.connection.execute('INSERT INTO inventory (user_id, item_id, amount) VALUES (?, ?, ?)', [user_id, item_id, amount]);
            console.log('Item added to inventory for user', user_id);
        } else {
            const updatedAmount = item.amount + amount;
            if (updatedAmount <= 0) {
                connection.connection.execute('DELETE FROM inventory WHERE user_id = ? AND item_id = ?', [user_id, item_id]);
                console.log('Item removed from inventory for user', user_id);
            } else {
                connection.connection.execute('UPDATE inventory SET amount = ? WHERE user_id = ? AND item_id = ?', [updatedAmount, user_id, item_id]);
                console.log('Inventory updated for user', user_id);
            }
        }
    } catch (err) {
        console.error('Error while trying to update balance:', err);
        throw err;
    }
}

async function getItems(category = null) {
    try {
        let query = 'SELECT * FROM items';
        let params = [];

        if (category !== null) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const [rows] = await connection.connection.execute(query, params);

        return rows;
    } catch (err) {
        console.error('Error while trying to fetch items:', err);
        throw err;
    }
}

async function getInventory(user_id) {
    try {
        const [rows] = await connection.connection.execute('SELECT * FROM inventory WHERE user_id = ?', [user_id]);

        return rows;
    } catch (err) {
        console.error('Error while trying to fetch inventory:', err);
        throw err;
    }
}

module.exports = {
    getItem,
    getUserItem,
    addItem,
    getItems,
    getInventory,
};