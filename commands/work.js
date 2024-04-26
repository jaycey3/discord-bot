const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 7200,
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to get paid!'),
	async execute(interaction) {
		const { getUser, addBalance, getJob, addWorkXP } = require('../index');

		const user = interaction.user;
		const { job_id: currentJob, work_xp: currentWorkXP } = await getUser(user.id);
		const { name: jobName, salary: jobSalary, xp: jobXP, emoji: jobEmoji } = await getJob(currentJob);

		if (currentJob == 0) {
			return interaction.reply({ content: '⚠️ **You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.**', ephemeral: true });
		}

		const embed = new EmbedBuilder()
		.setTitle(`${jobEmoji} ${jobName}`)
		.setColor('#2C2F33')
		.setDescription(`Thank you for completing your shift, **${user.displayName}**!

		Your salary of \`${jobSalary}\` 🪙 has been added to your balance.
		You now have \`${currentWorkXP + 1}\` 🎖️ work experience.`);
	
		addBalance(user.id, jobSalary);
		addWorkXP(user.id, 1);
		interaction.reply({ embeds: [embed] });

	},
};