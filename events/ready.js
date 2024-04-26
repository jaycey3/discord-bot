module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setStatus('idle');

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};