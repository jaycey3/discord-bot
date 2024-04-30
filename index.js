const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token, host, user, password, database } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

//Database
const mysql = require('mysql2/promise');

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });
    console.log('Connected with the database!');
    return connection;
  } catch (err) {
    console.error('Error while trying to connect to database', err);
    throw err;
  }
}

(async () => {
  const connection = await connectToDatabase();

  async function createUser(user_id) {
    const newUser = {
      user_id: user_id,
      balance: 0,
      job_id: 0,
      work_xp: 0
    };

    try {
      const result = await connection.execute(`INSERT INTO users (user_id, balance, job_id, work_xp) VALUES (?, ?, ?, ?)`, [newUser.user_id, newUser.balance, newUser.job_id, newUser.work_xp]);
      console.log('Added a new user', result);
    } catch (err) {
      console.error('Error while trying to add user:', err);
    }
  }

  async function getUser(user_id) {
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
      if (rows && rows.length > 0) {
        return rows[0];
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
          last_work_date: 0
        };
      }
    } catch (err) {
      console.error('Error while trying to fetch user:', err);
      throw err;
    }
  }

  async function getJob(job_id) {
    try {
      const [rows] = await connection.execute('SELECT * FROM jobs WHERE id = ?', [job_id]);
      if (rows && rows.length > 0) {
        return rows[0];
      } else {
        console.log('Job not found.');
        return;
      }
    } catch (err) {
      console.error('Error while trying to fetch job:', err);
      throw err;
    }
  }

  async function getItem(item_id) {
    try {
      const [rows] = await connection.execute('SELECT * FROM items WHERE id = ?', [item_id]);
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
      const [rows] = await connection.execute('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?', [user_id, item_id]);
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

  async function addBalance(user_id, amount) {
    try {
      const user = await getUser(user_id);
      if (user) {
        const updatedBalance = user.balance + amount;
        connection.execute('UPDATE users SET balance = ? WHERE user_id = ?', [updatedBalance, user_id]);
        console.log('Balance updated for user', user_id);
      }
    } catch (err) {
      console.error('Error while trying to update balance:', err);
      throw err;
    }
  }

  async function addItem(user_id, item_id, amount) {
    try {
      const item = await getUserItem(user_id, item_id);
      if (!item) {
        connection.execute('INSERT INTO inventory (user_id, item_id, amount) VALUES (?, ?, ?)', [user_id, item_id, amount]);
        console.log('Item added to inventory for user', user_id);
      } else {
        const updatedAmount = item.amount + amount;
        if (updatedAmount <= 0) {
          // Verwijder de rij uit de database als de hoeveelheid nul of negatief is
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

  async function addWorkXP(user_id, amount) {
    try {
      const user = await getUser(user_id);
      if (user) {
        const updatedWorkXP = user.work_xp + amount;
        connection.execute('UPDATE users SET work_xp = ? WHERE user_id = ?', [updatedWorkXP, user_id]);
        console.log('Work XP updated for user', user_id);
      }
    } catch (err) {
      console.error('Error while trying to update work XP:', err);
      throw err;
    }
  }

  async function addWorkStreak(user_id, amount) {
    try {
      const user = await getUser(user_id);
      if (user) {
        const updatedStreak = user.work_streak + amount;
        connection.execute('UPDATE users SET work_streak = ? WHERE user_id = ?', [updatedStreak, user_id]);
        console.log('Work Streak updated for user', user_id);
      }
    } catch (err) {
      console.error('Error while trying to update work streak:', err);
      throw err;
    }
  }

  async function setJob(user_id, job_id) {
    try {
      const user = await getUser(user_id);
      if (user) {
        connection.execute('UPDATE users SET job_id = ? WHERE user_id = ?', [job_id, user_id]);
        console.log('Job updated for user', user_id);
      }
    } catch (err) {
      console.error('Error while trying to update job:', err);
      throw err;
    }
  }

  async function resetWorkStreak(user_id) {
    try {
      const user = await getUser(user_id);
      if (user) {
        connection.execute('UPDATE users SET work_streak = DEFAULT WHERE user_id = ?', [user_id]);
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
        connection.execute('UPDATE users SET last_work_date = ? WHERE user_id = ?', [lastWorkTime, user_id]);
        console.log('Last work time updated for user', user_id);
      }
    } catch (err) {
      console.error('Error while trying to update last work time:', err);
      throw err;
    }
  }

  async function getAllJobs() {
    try {
      const [rows] = await connection.execute('SELECT * FROM jobs');

      return rows;
    } catch (err) {
      console.error('Error while trying to fetch jobs:', err);
      throw err;
    }
  }

  async function getInventory(user_id) {
    try {
      const [rows] = await connection.execute('SELECT * FROM inventory WHERE user_id = ?', [user_id]);

      return rows;
    } catch (err) {
      console.error('Error while trying to fetch inventory:', err);
      throw err;
    }
  }

  async function getTopUsers(limit) {
    try {
      const query = `SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT ?`;
      const [rows] = await connection.execute(query, [limit]);

      return rows;
    } catch (error) {
      console.error('Error fetching top users:', error);
      throw error;
    }
  }

  module.exports = {
    addBalance,
    addWorkXP,
    addWorkStreak,
    setJob,
    resetWorkStreak,
    setLastWorkTime,
    getUser,
    getJob,
    getInventory,
    getUserItem,
    addItem,
    getItem,
    getAllJobs,
    getTopUsers,
    client
  };
})();

// Command Handler
client.cooldowns = new Collection();
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({ content: `⏰ **Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.**`, ephemeral: true });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: '❗ **There was an error while executing this command!**', ephemeral: true });
  }
});

// Events Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Bot login
client.login(token);