const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  once: true,
  execute(message) {
    const verifyEmbed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setColor("#2f3136")
      .setDescription(`**Welcome to the server!**
      
      As you can see there are not many rules, just use common sense.
      Please click the button below to get access to the server.
      
      Have fun! <:PandBless:618885256262713346>`)
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('verify')
          .setEmoji('<:PandaCop2:802875458617999410>')
          .setLabel('Verify')
          .setStyle(ButtonStyle.Success)
      );

    if (message.author.id === '261901652993245186' && message.content === 'verify') {
      return message.channel.send({ embeds: [verifyEmbed], components: [row] })
        .then(message.delete());
    }
  },
};