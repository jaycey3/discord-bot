module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    const { addBalance } = require('../index');

    const amount = Math.floor(Math.random() * 10) + 1;

	if (message.author.bot) return;
	addBalance(message.author.id, amount);
  },
};