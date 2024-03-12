const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball a question!')
    .addStringOption(option => option.setName('question').setDescription('The question you want to ask the magic 8ball.').setRequired(true)),
  async execute(interaction) {
    const answers = [
      'Yes.',
      'I don\'t know.',
      'Fuck u.',
      'HAHAHAHAHA, don\'t really think so.',
      'Can\'t predict now.',
      'Absolutely not.',
      'Of course.',
      'Not so fast.',
      'Is that really a question you would ask me?',
      'I think so...',
      'Next question please.',
      'Without a doubt.',
      'Yes, definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'All signs point to yes.',
      'It is certain.',
      'Reply hazy, try again.',
      'Ask again please.',
      'Better not tell you now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
      'How am I supposed to know?',
    ];

    await interaction.reply({ content: '🎱 | Shaking the magic 8 ball...' });
    await wait(3000);
    await interaction.editReply({ content: '🎱 | **Answer:** ' + answers[Math.floor(Math.random() * answers.length)] });
  },
};