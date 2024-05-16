const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('View, apply for, or quit a job.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('apply')
                .setDescription('Apply for a job.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('View information about your current job.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('quit')
                .setDescription('Quit your current job.')),
    async execute(interaction) {
        const { setJob, getJob, getAllJobs } = require('../sql/jobQueries');
        const { getUser } = require('../sql/userQueries');
        const user = interaction.user;
        const { job_id: currentJob, work_xp: currentWorkXP, work_streak: streak } = await getUser(user.id);

        if (interaction.options.getSubcommand() === 'apply') {
            if (!currentJob == 0) {
                return interaction.reply({ content: '⚠️ **You already have a job! If you want to switch jobs, use `/job quit` to quit your current job.**', ephemeral: true });
            }

            await interaction.deferReply();
            const jobs = await getAllJobs();

            const select = new StringSelectMenuBuilder()
			.setCustomId('select')
			.setPlaceholder('Please select a job.');

            for (let job of jobs) {
                const { name: jobName, salary: jobSalary, xp: jobXP, emoji: jobEmoji, id: jobId } = await getJob(job.id);
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
					.setLabel(`${jobEmoji} ${jobName}`)
					.setDescription(`${jobSalary.toLocaleString()} 🪙 | ${jobXP} 🎖️`)
					.setValue(jobId.toString()),
                );
            }

            const row = new ActionRowBuilder()
	        .addComponents(select);

            const applyEmbed = new EmbedBuilder()
            .setTitle('📑 Available Jobs')
            .setColor('#2C2F33')
            .setDescription(`This is a list of all available jobs. Please select the job you would like to apply for using the select menu under this message.\n\nYou have \`3 minutes\` to select a job.`);

            const jobList = await interaction.editReply({ embeds: [applyEmbed], components: [row] });
            
            const collectorFilter = i => i.user.id === user.id;
            
            try {
                const selection = await jobList.awaitMessageComponent({ filter: collectorFilter, time: 180_000 });
                const job = selection.values[0];

                const { name: jobName, xp: jobXP, emoji: jobEmoji } = await getJob(job);

                if (jobXP > currentWorkXP) {
                    interaction.deleteReply();
                    return selection.reply({ content: `⚠️ **You need at least \`${jobXP}\` 🎖️ work experience to apply for this job. You currently have \`${currentWorkXP}\` 🎖️ work experience.**`, ephemeral: true, });
                }

                const appliedEmbed = new EmbedBuilder()
                .setTitle('🎉 Job Application')
                .setColor('#2C2F33')
                .setDescription(`Congratulations, **${user.displayName}**! You are now working as a **${jobEmoji} ${jobName}**!`)
                .setFooter({ text: 'You can use /work to start working!' });

                try {
                    await setJob(user.id, job);
                    await selection.update({ embeds: [appliedEmbed], components: [] });
                } catch (error) {
                    console.log("Error: ", error);
                    interaction.reply('⚠️ **There was an error trying to apply for a job.**');
                }
            } catch (e) {
                await interaction.editReply({ content: '⏰ **No job was selected within 3 minutes.**', components: [], embeds: [] });
            }
        } else if (interaction.options.getSubcommand() === 'info') {
            if (currentJob == 0) {
                return interaction.reply({ content: '⚠️ **You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.**', ephemeral: true });
            }

            const { name: jobName, salary: jobSalary, emoji: jobEmoji } = await getJob(currentJob);

            const embed = new EmbedBuilder()
                .setTitle(`👷 Job Information`)
                .setColor('#2C2F33')
                .setDescription(`You are currently working as a **${jobEmoji} ${jobName}**.`)
                .addFields(
                    { name: 'Salary', value: `\`${jobSalary.toLocaleString()}\` 🪙`, inline: true },
                    { name: 'Work Experience', value: `\`${currentWorkXP}\` 🎖️`, inline: true },
                    { name: 'Work Streak', value: `\`${streak}\` 🔥`, inline: true }
                );

            interaction.reply({ embeds: [embed] });

        } else if (interaction.options.getSubcommand() === 'quit') {
            if (currentJob == 0) {
                return interaction.reply({ content: '⚠️ **You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.**', ephemeral: true });
            }

            const { name: jobName, emoji: jobEmoji } = await getJob(currentJob);

            const embed = new EmbedBuilder()
                .setTitle('😢 We are sorry to see you go')
                .setColor('#2C2F33')
                .setDescription(`We hope you enjoyed your time as a **${jobEmoji} ${jobName}**.`);

            try {
                await setJob(user.id, 0);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.log("Error: ", error);
                interaction.reply({ content: 'There was an error trying to quit your job.', ephemeral: true });
            }
        }
    },
};