const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 7200,
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to get paid!'),
	async execute(interaction) {
		const { getJob, getWorkXP, addBalance, addWorkXP } = require('../index');
		const jobInformation = require('../util/jobs.js');
		const user = interaction.user;
		const job = await getJob(user.id);
		const workxp = await getWorkXP(user.id);
		const jobData = job ? jobInformation[job][0] : null;


		if (!job) {
			return interaction.reply({ content: 'You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.', ephemeral: true });
		}

		const embed = new EmbedBuilder()
		.setTitle(`${jobData.emoji} ${jobData.name}`)
		.setColor('#2C2F33')
		.setDescription(`Thank you for completing your shift, **${user.displayName}**!

		Your salary of \`${jobData.salary}\` 🪙 has been added to your balance.
		You now have \`${workxp + 1}\` 🎖️ work experience.`);
	
		addBalance(user.id, jobData.salary);
		addWorkXP(user.id, 1);
		interaction.reply({ embeds: [embed] });

	},
};