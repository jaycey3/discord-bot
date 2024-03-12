const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 7200,
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for a job')
    .addStringOption(option =>
        option.setName('job')
        .setDescription('Which job do you wan to apply for?')
        .setRequired(true)
        .addChoices(
            { name: 'McDonald\'s worker', value: 'McDonald\'s worker'},
        )),
  async execute(interaction) {
    const { setJob, getJob, addBalance } = require('../index');
    const job = interaction.options.getString('job');
    const user = interaction.user;
    const currentJob = await getJob(user.id);
    const bonus = {
        'McDonald\'s worker': 100
    };

    if (currentJob) {
        return interaction.reply({ content: 'You already have a job! If you want to switch jobs, use `/quit` to quit your current job.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
    .setTitle('👷 Job Application')
    .setDescription(`Congratulations! You are now a **${job}**!
    
    💰 They have given you a sign-on bonus of \`${bonus[job]}\` 🪙`)
    .setFooter({ text: 'You can use /work to start working!' });
    
    try {
        await setJob(user.id, job);
        await addBalance(user.id, bonus[job]);
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.log("Error: ", error);
        interaction.reply('There was an error trying to apply for a job.');
    }
  },
};