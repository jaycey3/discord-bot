const { EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(interaction) {
      if (!interaction.channel.id === '1031384141725437972') return;
      if (!interaction.isButton()) return;

      const memberRole = interaction.guild.roles.cache.get('617018057247686656');

      if (interaction.customId === 'verify') {
        const verifyEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }))
        .setDescription(`**✅ Successfully verified!**
        
        Welcome ${interaction.member.toString()}!
        You were successfully verified and will get access to the server shortly.
        
        Waiting for your roles <a:Loading:802873002609344532>`)
        .setTimestamp()

        const verifyEmbed2 = new EmbedBuilder()
        .setColor('#2f3136')
        .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }))
        .setDescription(`**✅ Successfully verified!**

        Welcome ${interaction.member.toString()}!
        You were successfully verified and will get access to the server shortly.
        
        The <@&617018057247686656> role had been added!
        Have fun! <:PandaCool:802875427491414028>`)
        .setTimestamp()

        interaction.reply({ embeds: [verifyEmbed] });
        setTimeout(() => {
            interaction.editReply({ embeds: [verifyEmbed2] });
          }, 5000);
        setTimeout(() => {
            interaction.member.roles.add(memberRole)
          }, 10000);
        setTimeout(() => {
          interaction.deleteReply();
        }, 15000);
      }
    },
  };