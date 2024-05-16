const lastBalance = new Map();

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        const { addBalance } = require('../sql/economyQueries');

        const amount = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

        if (message.author.bot) return;

        const lastBalanceTime = lastBalance.get(message.author.id) || 0;
        const currentTime = Date.now();

        if (currentTime - lastBalanceTime >= 25000) {
            addBalance(message.author.id, amount);
            lastBalance.set(message.author.id, currentTime);
        }
    },
};
