const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { join } = require('path');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Check your own or someone else\'s xp level.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to check the level of.')
        .setRequired(false)),
  async execute(interaction) {
    const { getUser } = require('../sql/userQueries');
    const { getLevels } = require('../sql/xpQueries');
    const { getUserSettings, getSetting } = require('../sql/settingsQueries');
    const target = interaction.options.getUser('user') ?? interaction.user;
    const user = await getUser(target.id);
    const levels = await getLevels();
    const xp = user.xp;

    let userLevel = 0;
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].total_xp) {
        userLevel = i + 1;
      } else {
        break;
      }
    }

    let currentXP = xp - (levels[userLevel - 1]?.total_xp ?? 0);
    let nextLevelXP = levels[userLevel]?.xp ?? 0;
    let percentage = Math.floor((currentXP / nextLevelXP) * 100);
    let barLength = Math.floor((percentage / 100) * 450);
    if (barLength < 30) barLength = 30;

    let color;

    const userSettings = await getUserSettings(target.id);
    const colorId = userSettings.level_color;

    if (colorId == 0) {
      color = '#fcba03';
    } else if (colorId == 9) {
      if (userSettings.custom_color === 'none') {
        color = '#fcba03';
      } else {
        color = userSettings.custom_color;
      }
    } else {
      const getColor = await getSetting(colorId);
      color = getColor.value
    }

    const canvas = Canvas.createCanvas(700, 200);
    const context = canvas.getContext('2d');

    let background;
    const backgroundId = userSettings.level_background;

    if (backgroundId == 0) {
      context.beginPath();
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#1f1f1f';
      context.fill();
    } else {
      const getBackground = await getSetting(backgroundId);
      background = await Canvas.loadImage(`./backgrounds/${getBackground.value}.png`);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    // small rectangle
    context.beginPath();
    context.roundRect(25, 25, 650, 150, 5);
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fill();

    // level bar background
    context.beginPath();
    context.roundRect(180, 120, 450, 30, 20);
    context.fillStyle = '#ffffff';
    context.fill();

    // level bar
    context.beginPath();
    context.roundRect(178, 119.5, barLength + 3, 31, 20);
    context.fillStyle = color;
    context.fill();

    // Name
    Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', 'fonts', 'Rubik-VariableFont_wght.ttf'), 'rubik-font');
    context.font = '25px rubik-font';
    context.fillStyle = '#ffffff';
    context.textAlign = 'left';
    context.fillText(`${target.displayName}`, 185, 100)

    // XP
    context.beginPath()
    context.font = '25px rubik-font';
    context.fillStyle = '#bfbfbf';
    context.textAlign = 'right';
    context.fillText(`${currentXP.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP (${percentage}%)`, 625, 100)

    // Level
    context.beginPath()
    context.font = '30px rubik-font';
    context.fillStyle = color;
    context.textAlign = 'right';
    context.fillText(`LEVEL ${userLevel}`, 625, 70)

    // Avatar Border
    context.beginPath();
    context.fillStyle = '#ffffff';
    context.arc(100, 100, 50, 0, Math.PI * 2, true);
    context.fill();

    // Avatar
    const response = await axios.get(target.avatarURL({ dynamic: false, size: 512 }), {
      responseType: 'arraybuffer'
    });
    const avatar = await Canvas.loadImage(Buffer.from(response.data));

    context.beginPath();
    context.arc(100, 100, 48, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    context.drawImage(avatar, 52, 52, 96, 96);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'level.png' });

    interaction.reply({ files: [attachment] });
  },
};