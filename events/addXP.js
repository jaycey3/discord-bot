const lastXP = new Map();

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        const { addXP } = require('../index');

        const amount = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

        if (message.author.bot) return;

        const lastXPTime = lastXP.get(message.author.id) || 0;
        const currentTime = Date.now();

        if (currentTime - lastXPTime >= 25000) {
            addXP(message.author.id, amount, message.channel.id);
            lastXP.set(message.author.id, currentTime);
        }
    },
};
