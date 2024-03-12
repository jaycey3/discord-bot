const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays the avatar of the specified user.')
    .addUserOption(option => option.setName('user').setDescription('The user you want to display the avatar from.').setRequired(false)),
  async execute(interaction) {
    const optionMember = interaction.options.getMember('user');
    const avMember = optionMember || interaction.member;

    const avatarEmbed = new EmbedBuilder()
      .setColor(avMember.displayHexColor)
      .setAuthor({ name: `${avMember.user.displayName} (${avMember.user.username})`, iconURL: avMember.user.avatarURL({ dynamic: true }) })
      .setImage(avMember.user.avatarURL({ dynamic: true, size: 512 }))
      .setTimestamp();

    await interaction.reply({ embeds: [avatarEmbed] });
  },
};