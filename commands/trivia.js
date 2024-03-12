const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const he = require('he');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer the question correctly!')
    .addStringOption(option => 
      option.setName('category')
      .setDescription('The category of the question')
      .setRequired(false)
      .addChoices(
        { name: 'General Knowledge', value: '9' },
				{ name: 'Entertainment: Books', value: '10' },
				{ name: 'Entertainment: Film', value: '11' },
        { name: 'Entertainment: Music', value: '12' },
        { name: 'Entertainment: Musicals & Theatres', value: '13' },
        { name: 'Entertainment: Television', value: '14' },
        { name: 'Entertainment: Video Games', value: '15' },
        { name: 'Entertainment: Board Games', value: '16' },
        { name: 'Science & Nature', value: '17' },
        { name: 'Science: Computers', value: '18' },
        { name: 'Science: Mathematics', value: '19' },
        { name: 'Mythology', value: '20' },
        { name: 'Sports', value: '21' },
        { name: 'Geography', value: '22' },
        { name: 'Politics', value: '24' },
        { name: 'Art', value: '25' },
        { name: 'Celebrities', value: '26' },
        { name: 'Animals', value: '27' },
    ))
    .addStringOption(option =>
      option.setName('difficulty')
      .setDescription('The difficulty of the question')
      .setRequired(false)
      .addChoices(
        { name: 'Easy', value: 'easy' },
        { name: 'Medium', value: 'medium' },
        { name: 'Hard', value: 'hard' },
      ))
    .addStringOption(option =>
      option.setName('public')
      .setDescription('Whether you want everyone to be able to answer your question. (default: no)')
      .setRequired(false)
      .addChoices(
        { name: 'Yes', value: 'yes' },
        { name: 'No', value: 'no' },
      )),

  async execute(interaction) {
    const axios = require('axios');
    const { addBalance } = require('../index');
    const reward = 50;

    let category = interaction.options.getString('category');
    let difficulty = interaction.options.getString('difficulty');
    let public = interaction.options.getString('public') ?? 'no';

    await interaction.deferReply();

    let url;

    if (category && !difficulty) {
      url = `https://opentdb.com/api.php?amount=1&category=${category}&type=multiple`;
    } else if (difficulty && !category) {
      url = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple`;
    } else if (category && difficulty) {
      url = `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`;
    } else {
      url = `https://opentdb.com/api.php?amount=1&type=multiple`;
    }

    try {
        const response = await axios.get(url);
        const triviaQuestion =  response.data.results;
        if (triviaQuestion.length === 0) {
            throw new Error('I did not receive a question from the API!');
        }

        const question = triviaQuestion[0];
        const decodedQuestion = he.decode(question.question);
        const decodedCategory = he.decode(question.category);

        const questionDifficulty = {
          'easy': 'Easy',
          'medium': 'Medium',
          'hard': 'Hard',
        };

        const mode = {
          'yes': 'PUBLIC',
          'no': 'PRIVATE',
        };

        const options = [question.incorrect_answers, question.correct_answer];
        const decodedOptions = options.flat().map(option => he.decode(option));
        decodedOptions.sort(() => Math.random() - 0.5);

        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('trivia_1')
            .setLabel(decodedOptions[0])
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId('trivia_2')
            .setLabel(decodedOptions[1])
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId('trivia_3')
            .setLabel(decodedOptions[2])
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId('trivia_4')
            .setLabel(decodedOptions[3])
            .setStyle(ButtonStyle.Secondary),
        );

        const questionEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle('🌟 Trivia')
        .setColor('#2C2F33')
        .setDescription(`**${decodedQuestion}**\n\n**Category:** ${decodedCategory}\n**Difficulty:** ${questionDifficulty[question.difficulty]}\n**Mode:** ${mode[public]}`)
        .setFooter({ text: 'You have 30 seconds to answer the question' })

        const questionEmbedCorrect = new EmbedBuilder()
        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle('🌟 Trivia')
        .setColor('#3ba55c')
        .setDescription(`**${decodedQuestion}**\n\n**Category:** ${decodedCategory}\n**Difficulty:** ${questionDifficulty[question.difficulty]}\n**Mode:** ${mode[public]}\n\nAdded \`${reward.toString()}\` 🪙 to your balance.`)

        const questionEmbedIncorrect = new EmbedBuilder()
        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle('🌟 Trivia')
        .setColor('#ed4245')
        .setDescription(`**${decodedQuestion}**\n\n**Category:** ${decodedCategory}\n**Difficulty:** ${questionDifficulty[question.difficulty]}\n**Mode:** ${mode[public]}`)

        const questionEmbedTime = new EmbedBuilder()
        .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle('🌟 Trivia')
        .setColor('#5865f2')
        .setDescription(`**${decodedQuestion}**\n\n**Category:** ${decodedCategory}\n**Difficulty:** ${questionDifficulty[question.difficulty]}\n**Mode:** ${mode[public]}`)

        const trivia = await interaction.editReply({ embeds: [questionEmbed], components: [row] });

        const collectorFilter = i => i.user.id === interaction.user.id;

        const timeButtons = [
          new ButtonBuilder()
            .setCustomId('trivia_1')
            .setLabel(decodedOptions[0])
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        
          new ButtonBuilder()
            .setCustomId('trivia_2')
            .setLabel(decodedOptions[1])
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        
          new ButtonBuilder()
            .setCustomId('trivia_3')
            .setLabel(decodedOptions[2])
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        
          new ButtonBuilder()
            .setCustomId('trivia_4')
            .setLabel(decodedOptions[3])
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        ];

        const timeRow = new ActionRowBuilder().addComponents(...timeButtons);

        try {
        let answer;

          if (public === 'yes') {
            answer = await trivia.awaitMessageComponent({ time: 30_000 });
          } else if (public === 'no') {
            answer = await trivia.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
          }

          const correctAnswer = he.decode(question.correct_answer);

          const correctButtonIndex = decodedOptions.indexOf(correctAnswer) + 1;
          const clickedButtonIndex = parseInt(answer.customId.split('_')[1]);

          const newButtons = [
            new ButtonBuilder()
              .setCustomId('trivia_1')
              .setLabel(decodedOptions[0])
              .setStyle(correctButtonIndex === 1 ? ButtonStyle.Success : clickedButtonIndex === 1 ? ButtonStyle.Danger : ButtonStyle.Secondary)
              .setDisabled(true),
          
            new ButtonBuilder()
              .setCustomId('trivia_2')
              .setLabel(decodedOptions[1])
              .setStyle(correctButtonIndex === 2 ? ButtonStyle.Success : clickedButtonIndex === 2 ? ButtonStyle.Danger : ButtonStyle.Secondary)
              .setDisabled(true),
          
            new ButtonBuilder()
              .setCustomId('trivia_3')
              .setLabel(decodedOptions[2])
              .setStyle(correctButtonIndex === 3 ? ButtonStyle.Success : clickedButtonIndex === 3 ? ButtonStyle.Danger : ButtonStyle.Secondary)
              .setDisabled(true),
          
            new ButtonBuilder()
              .setCustomId('trivia_4')
              .setLabel(decodedOptions[3])
              .setStyle(correctButtonIndex === 4 ? ButtonStyle.Success : clickedButtonIndex === 4 ? ButtonStyle.Danger : ButtonStyle.Secondary)
              .setDisabled(true),
          ];

          const newRow = new ActionRowBuilder().addComponents(...newButtons);

          if (answer.customId === 'trivia_' + (decodedOptions.indexOf(correctAnswer) + 1)) {
            await addBalance(interaction.user.id, reward);
            await answer.update({ content: `🎉 **You won!** The correct answer is **${correctAnswer}**.`, components: [newRow], embeds: [questionEmbedCorrect] });
          } else {
            await answer.update({ content: `😢 **You lost!** The correct answer is **${correctAnswer}**.`, components: [newRow], embeds: [questionEmbedIncorrect] });
          }

        } catch (e) {
          try {
            await interaction.editReply({ content: '⏱️ **You lost!** Failed to answer the question within 30 seconds.', embeds: [questionEmbedTime], components: [timeRow] });
          } catch (error) {
            console.log('Error while trying to edit the reply: ', error)
          }
        }
    } catch (error) {
        return console.log('There was an error while fetching the trivia question: ', error),
        interaction.editReply({ content: 'There was an error while fetching the trivia question. Please try again.', ephemeral: true })
    }
  },
};