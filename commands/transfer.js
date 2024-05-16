const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer currency to another user.')
    .addUserOption(option => 
        option.setName('user')
        .setDescription('The user you want to transfer currency to.')
        .setRequired(true))
    .addIntegerOption(option => 
        option.setName('amount')
        .setDescription('The amount you want to transfer to the user.')
        .setRequired(true)),
  async execute(interaction) {
    const { addBalance } = require('../sql/economyQueries');
    const { getUser } = require('../sql/userQueries');
    const user = await getUser(interaction.user.id);
    const balance = user.balance;

	const transferAmount = interaction.options.getInteger('amount');
	const target = interaction.options.getUser('user');

    if (target.id === interaction.user.id) {
        return interaction.reply({ content: `⚠️ **Sorry, but you can not transfer 🪙 to yourself.**`, ephemeral: true });
    }

	if (transferAmount > balance) {
        return interaction.reply({ content: `⚠️ **Sorry, but you only have \`${balance.toLocaleString()}\` 🪙.**`, ephemeral: true });
    }
	if (transferAmount <= 0) {
        return interaction.reply({ content: `⚠️ **Please enter an amount greater than \`0\` 🪙.**`, ephemeral: true });
    }

    addBalance(interaction.user.id, -transferAmount);
	addBalance(target.id, transferAmount);

    const embed = new EmbedBuilder()
    .setTitle('💸 Transfer')
    .setColor('#2C2F33')
    .setDescription(`Successfully transferred \`${transferAmount.toLocaleString()}\` 🪙 to ${target.toString()}.`)
    .setThumbnail(target.avatarURL({ dynamic: true }))

    return interaction.reply({ embeds: [embed] });
  },
};