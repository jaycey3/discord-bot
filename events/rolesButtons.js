module.exports = {
  name: 'interactionCreate',
  once: false,
  execute(interaction) {
    const redID = '695052714652074104';
    const orangeID = '695052716598231170';
    const yellowID = '695052718321958923';
    const greenID = '695052720591077416';
    const blueID = '695052721878728715';
    const purpleID = '695052723854376971';
    const pinkID = '695052725880225792';
    const blackID = '695052727574593596';
    const whiteID = '695052728988336129';

    const redRole = interaction.guild.roles.cache.get(redID);
    const orangeRole = interaction.guild.roles.cache.get(orangeID);
    const yellowRole = interaction.guild.roles.cache.get(yellowID);
    const greenRole = interaction.guild.roles.cache.get(greenID);
    const blueRole = interaction.guild.roles.cache.get(blueID);
    const purpleRole = interaction.guild.roles.cache.get(purpleID);
    const pinkRole = interaction.guild.roles.cache.get(pinkID);
    const blackRole = interaction.guild.roles.cache.get(blackID);
    const whiteRole = interaction.guild.roles.cache.get(whiteID);

    if (!interaction.channel.id === '695041856886800440') return;
    if (!interaction.isButton()) return;

    if (interaction.customId === 'roleRemove') {
      if (!interaction.member.roles.cache.hasAny(redID, orangeID, yellowID, greenID, blueID, purpleID, pinkID, blackID, whiteID)) {
        return interaction.reply({ content: `${interaction.member.toString()}, you do not have a role I can remove, please select a role by using the other buttons!` }),
        setTimeout(() => {
          interaction.deleteReply();
        }, 10000);
      }

      return interaction.member.roles.remove([redRole, orangeRole, yellowRole, greenRole, blueRole, purpleRole, pinkRole, blackRole, whiteRole]),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully removed your roles!` }),
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.channel.id === '695041856886800440' && interaction.member.roles.cache.hasAny(redID, orangeID, yellowID, greenID, blueID, purpleID, pinkID, blackID, whiteID)) {
      return interaction.reply({ content: `${interaction.member.toString()}, you already have a role! Please click the \`❌ Remove\` button to remove your role and try again!` }),
      setTimeout(() => {
        interaction.deleteReply();
      }, 10000);
    }

    if (interaction.customId === 'roleRed') {
      interaction.member.roles.add(redRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`❤️ Red\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleOrange') {
      interaction.member.roles.add(orangeRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`🧡 Orange\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleYellow') {
      interaction.member.roles.add(yellowRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`💛 Yellow\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleGreen') {
      interaction.member.roles.add(greenRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`💚 Green\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleBlue') {
      interaction.member.roles.add(blueRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`💙 Blue\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'rolePurple') {
      interaction.member.roles.add(purpleRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`💜 Purple\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'rolePink') {
      interaction.member.roles.add(pinkRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`💗 Pink\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleBlack') {
      interaction.member.roles.add(blackRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`🖤 Black\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }

    if (interaction.customId === 'roleWhite') {
      interaction.member.roles.add(whiteRole),
      interaction.reply({ content: `${interaction.member.toString()}, Successfully added \`🤍 White\`!` });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }
  },
};