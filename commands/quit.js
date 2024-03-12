const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quit')
    .setDescription('Quit your job.'),
  async execute(interaction) {
    const { setJob, getJob } = require('../index');
    const user = interaction.user;
    const job = await getJob(user.id);

    const embed = new EmbedBuilder()
    .setTitle('😢 We are sorry to see you go')
    .setDescription(`We hope you enjoyed your time as a **${job}**.`);

    if (job) {
        try {
            await setJob(user.id, "");
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log("Error: ", error);
            interaction.reply({content: 'There was an error trying to quit your job.', ephemeral: true });
        }
    } else {
        interaction.reply({ content: 'You don\'t have a job! You can use `/apply` to apply for a job and start earning money.', ephemeral: true });
    }
  },
};