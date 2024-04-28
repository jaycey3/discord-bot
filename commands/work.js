const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 3600,
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to get paid!'),
	async execute(interaction) {
		const { getUser, addBalance, getJob, addWorkXP, addWorkStreak, setLastWorkTime, resetWorkStreak } = require('../index');
		const user = interaction.user;
		let { job_id: currentJob, work_xp: currentWorkXP, work_streak: streak, last_work_date: last_work_date } = await getUser(user.id);

		if (currentJob == 0) {
			return interaction.reply({ content: '⚠️ **You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.**', ephemeral: true });
		}

		const now = Date.now();
		const lastWorkDate = new Date(last_work_date).getTime();
		const { name: jobName, salary: jobSalary, emoji: jobEmoji } = await getJob(currentJob);

		const bonus = {
			10: 250,
			20: 500,
			30: 750,
			40: 1000,
			50: 1250,
			60: 1500,
			70: 1750,
			80: 2000,
			90: 2250,
			100: 2500,
		};

		if (lastWorkDate && now - lastWorkDate >= 30000) {
            await resetWorkStreak(user.id);
			streak = 0;
        }

		const embed = new EmbedBuilder()
		.setTitle(`${jobEmoji} ${jobName}`)
		.setColor('#2C2F33')
		.setDescription(`Thank you for completing your shift, **${user.displayName}**!

		Your salary of \`${jobSalary.toLocaleString()}\` 🪙 has been added to your balance.
		You now have \`${currentWorkXP + 1}\` 🎖️ work experience.
		You now have work streak of \`${streak + 1}\` 🔥`);

		if (streak >= 9) {
			let bonusLevel = Math.floor((streak + 1) / 10) * 10;
			if (bonusLevel > 100) {
				bonusLevel = 100;
			}

			console.log('BONUS GIVEN')
			const bonusAmount = bonus[bonusLevel];
			addBalance(user.id, bonusAmount);
			embed.addFields(
				{ name: 'Bonus', value: `You have received a bonus of \`${bonusAmount}\` 🪙 for having a work streak of \`${streak + 1}\` 🔥` }
			);
		}

		setLastWorkTime(user.id, now);
		addWorkStreak(user.id, 1);
		addBalance(user.id, jobSalary);
		addWorkXP(user.id, 1);
		interaction.reply({ embeds: [embed] });
	},
};