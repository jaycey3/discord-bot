const { AttachmentBuilder, SlashCommandBuilder} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { join } = require('path');
const axios = require('axios');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    const memberLogChannel = member.guild.channels.cache.get('617021925712986122');
    
    const canvas = Canvas.createCanvas(564, 317);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./images/welcome.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'fonts', 'Rubik-VariableFont_wght.ttf'), 'rubik-font');
    context.font = '30px rubik-font';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(`Welcome to ${member.guild.name}`, 282, 250)

    context.font = '25px rubik-font';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(`${member.user.displayName} (${member.user.username})`, 282, 280)

    context.beginPath();
    context.arc(282, 125, 78.5, 0, Math.PI * 2, true);
    context.fill();

    const response = await axios.get(member.user.avatarURL({ dynamic: false, size: 512 }), {
      responseType: 'arraybuffer'
    });
    const avatar = await Canvas.loadImage(Buffer.from(response.data));

    context.beginPath();
    context.arc(282, 125, 75, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    context.drawImage(avatar, 207, 50, 150, 150);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });

    memberLogChannel.send({ files: [attachment] });
  },
};