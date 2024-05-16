const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock features for your personal settings.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('color')
                .setDescription('Unlock a level color.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('background')
                .setDescription('Unlock a level background.')),
    async execute(interaction) {
        const { getUserSettings, getAllUnlockables, getUnlockable, getUserSetting } = require('../sql/settingsQueries');
        const { getUser } = require('../sql/userQueries');
        const user = interaction.user;
        const settings = await getUserSettings(user.id);
        const unlockables = await getAllUnlockables();

        if (interaction.options.getSubcommand() === 'color') {

            let unlockedColors = [];

            function getAllUnlockedColors() {
                for (let unlockable of unlockables) {
                    getUserSetting(user.id, unlockable.id);

                    unlockedColors.push(unlockable.id);
                }
            }

            await interaction.deferReply();

            const select = new StringSelectMenuBuilder()
			.setCustomId('select')
			.setPlaceholder('Please select setting to unlock.');

            for (let job of unlockables) {
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

            const embed = new EmbedBuilder()
            .setTitle('📑 Available Jobs')
            .setColor('#2C2F33')
            .setDescription(`This is a list of all available jobs. Please select the job you would like to apply for using the select menu under this message.\n\nYou have \`3 minutes\` to select a job.`);

            const jobList = await interaction.editReply({ embeds: [embed], components: [row] });
            
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
        }
    },
};