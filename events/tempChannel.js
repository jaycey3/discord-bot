const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  async execute(newState) {
    // let channelId = '713473027119120434';
    // let member = newState.member;

    // if (newState.channelId === channelId) {

    // let channel = await newState.guild.channels.create({
    //     name: member.displayName,
    //     type: ChannelType.GuildVoice,
    //     permissionOverwrites: [
    //        {
    //          id: member.id,
    //          allow: [PermissionFlagsBits.ViewChannel],
    //       },
    //     ],
    //   });

    // channel.send({ content: `Welcome to your own channel ${member.toString()}!`})

    // newState.channel.send({ content: `${member.displayName} Connected to channel` })
    // }
  },
};