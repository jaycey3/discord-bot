const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    const reactionRolesEmbed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({ dynamic : true }))
      .setAuthor({ name: '🎁 Coloured roles!' })
      .setDescription(`➼ Click on the buttons below to get your roles!
    
      ❤️ ➜ <@&695052714652074104>
      🧡 ➜ <@&695052716598231170>
      💛 ➜ <@&695052718321958923>
      💚 ➜ <@&695052720591077416>
      💙 ➜ <@&695052721878728715>
      💜 ➜ <@&695052723854376971>
      💗 ➜ <@&695052725880225792>
      🖤 ➜ <@&695052727574593596>
      🤍 ➜ <@&695052728988336129>
      
      You can click on the \`❌ Remove\` button to remove your roles.
      `)
      .setFooter({ text: 'You can select only one colour.' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('roleRed')
          .setEmoji('❤️')
          .setLabel('Red')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleOrange')
          .setEmoji('🧡')
          .setLabel('Orange')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleYellow')
          .setEmoji('💛')
          .setLabel('Yellow')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleGreen')
          .setEmoji('💚')
          .setLabel('Green')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleBlue')
          .setEmoji('💙')
          .setLabel('Blue')
          .setStyle(ButtonStyle.Secondary),
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rolePurple')
          .setEmoji('💜')
          .setLabel('Purple')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('rolePink')
          .setEmoji('💗')
          .setLabel('Pink')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleBlack')
          .setEmoji('🖤')
          .setLabel('Black')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleWhite')
          .setEmoji('🤍')
          .setLabel('White')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('roleRemove')
          .setEmoji('✖️')
          .setLabel('Remove')
          .setStyle(ButtonStyle.Danger),
      );

    if (message.author.id === '261901652993245186' && message.content === 'reactionroles') {
      return message.channel.send({ embeds: [reactionRolesEmbed], components: [row, row2] })
        .then(message.delete());
    }
  },
};