const axios = require('axios');
const { bridgeChannelId, bridgeUrl, bridgeSecret } = require('../config.json');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (!bridgeChannelId || !bridgeUrl || !bridgeSecret) return;

    if (message.channelId !== bridgeChannelId) return;
    if (message.author.bot || message.webhookId) return;

    let content = message.cleanContent.replace(/\n/g, ' ').trim();
    if (!content && message.attachments.size > 0) content = '(sent an attachment)';
    if (!content) return;

    try {
      await axios.post(
        bridgeUrl,
        {
          author: message.member?.displayName ?? message.author.username,
          content,
        },
        {
          headers: { 'X-Secret': bridgeSecret },
          timeout: 5000,
        },
      );
    } catch (err) {
      console.warn('[MC bridge] Could not reach Minecraft server:', err.message);
    }
  },
};