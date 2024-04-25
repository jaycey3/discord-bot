const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jobs = require('../util/jobs.js');

function generateJobChoices() {
    const choices = [];
    for (const jobId in jobs) {
        const job = jobs[jobId][0];
        choices.push({ name: job.name, value: jobId });;
    }
    return choices;
}

const jobChoices = generateJobChoices();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('View, apply for, or quit a job.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('apply')
                .setDescription('Apply for a job.')
                .addStringOption(option =>
                    option.setName('job')
                        .setDescription('Which job do you want to apply for?')
                        .setRequired(true)
                        .addChoices(jobChoices)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('View information about your current job.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('quit')
                .setDescription('Quit your current job.')),
    async execute(interaction) {
        const { setJob, getJob, getWorkXP } = require('../index');
        const jobInformation = require('../util/jobs.js');
        const user = interaction.user;
        const job = await getJob(user.id);
        const workxp = await getWorkXP(user.id);

        if (interaction.options.getSubcommand() === 'apply') {
            const jobOption = interaction.options.getString('job');
            const jobData = jobOption ? jobInformation[jobOption][0] : null;

            if (job) {
                return interaction.reply({ content: 'You already have a job! If you want to switch jobs, use `/job quit` to quit your current job.', ephemeral: true });
            }

            if (jobData.xp > workxp) {
                return interaction.reply({ content: `You need at least \`${jobData.xp}\` 🎖️ work experience to apply for this job. You currently have \`${workxp}\` 🎖️ work experience.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('🎉 Job Application')
                .setDescription(`Congratulations, **${user.displayName}**! You are now a **${jobData.name}**!`)
                .setFooter({ text: 'You can use /work to start working!' });

            try {
                await setJob(user.id, jobOption);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.log("Error: ", error);
                interaction.reply('There was an error trying to apply for a job.');
            }
        } else if (interaction.options.getSubcommand() === 'info') {
            console.log(jobChoices)
            const jobData = job ? jobInformation[job][0] : null;

            if (!job) {
                return interaction.reply({ content: 'You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(`👷 Job Information`)
                .setDescription(`You are currently working as a **${jobData.name}**.`)
                .addFields(
                    { name: 'Salary', value: `\`${jobData.salary}\` 🪙`, inline: true },
                    { name: 'Work Experience', value: `\`${workxp}\` 🎖️`, inline: true }
                );

            interaction.reply({ embeds: [embed] });

        } else if (interaction.options.getSubcommand() === 'quit') {
            const jobData = job ? jobInformation[job][0] : null;

            if (!job) {
                return interaction.reply({ content: 'You don\'t have a job! You can use `/job apply` to apply for a job and start earning money.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('😢 We are sorry to see you go')
                .setDescription(`We hope you enjoyed your time as a **${jobData.name}**.`);

            try {
                await setJob(user.id, "");
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.log("Error: ", error);
                interaction.reply({ content: 'There was an error trying to quit your job.', ephemeral: true });
            }
        }
    },
};