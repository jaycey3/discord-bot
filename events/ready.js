const { Users } = require('../dbObjects');
const { currency } = require('../index');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));

    console.log('Synced the database! ')

    client.user.setStatus('idle');

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};