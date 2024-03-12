const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 1,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to get paid!'),
  async execute(interaction) {
    const { addBalance, getJob, getBalance } = require('../index');
    const user = interaction.user;
    const jobString = await getJob(user.id);
    const job = convertJobName(jobString);

    function convertJobName(job) {
      if (!jobString) {
        return '';
      } else {
        return job.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      }
  }

    if (!jobString) {
        return interaction.reply({ content: 'You don\'t have a job! You can use `/apply` to apply for a job and start earning money.', ephemeral: true });
    }

    await interaction.deferReply();

    const jobs = {
      mcdonaldsworker: [
        {
          name: '🍔 McDonald\'s worker',
          salary: 1500,
        }
      ],
      teacher: [
        {
          name: '📚 Teacher',
          salary: 200,
        }
      ],
      doctor: [
        {
          name: '🩺 Doctor',
          salary: 300,
        }
      ],
    }

    const questions = {
      mcdonaldsworker: [
        {
          question: "In what year did the first McDonald's open?",
          correctAnswer: "1940",
          incorrectAnswers: ["1941", "1942", "1939"]
        },
        {
          question: "How many Chicken McNuggets are in a Happy Meal?",
          correctAnswer: "4",
          incorrectAnswers: ["6", "9", "12"]
        },
        {
          question: "What is the name of the McDonald's mascot?",
          correctAnswer: "Ronald McDonald",
          incorrectAnswers: ["Donald McDonald", "Reynold McDonald", "Arnold McDonald"]
        },
        {
          question: "What is McDonald's slogan?",
          correctAnswer: "I'm Lovin' It",
          incorrectAnswers: ["I'm Likin' it", "I'm Eating It", "I'm Drinking It"]
        },
        {
          question: "What is the name of the McDonald's signature burger?",
          correctAnswer: "Big Mac",
          incorrectAnswers: ["Big Tasty", "Hamburger", "McChicken"]
        },
        {
          question: "What is the name of McDonald's fish burger?",
          correctAnswer: "Filet-O-Fish",
          incorrectAnswers: ["Fish Burger", "McFish", "Fish-O-Filet"]
        },
        {
          question: "What is the name of McDonald's chicken burger?",
          correctAnswer: "McChicken",
          incorrectAnswers: ["Chicken Burger", "Chicken McNuggets", "Chicken-O-Mc"]
        }
      ],
      teacher: [
        {
          question: "What is the capital of France?",
          correctAnswer: "Paris",
          incorrectAnswers: ["London", "Berlin", "Rome"]
        },
        // Voeg hier nog 9 andere vragen toe voor leraren
      ],
      doctor: [
        {
          question: "What organ pumps blood around the body?",
          correctAnswer: "Heart",
          incorrectAnswers: ["Brain", "Liver", "Lungs"]
        },
        // Voeg hier nog 9 andere vragen toe voor artsen
      ],
      // Voeg hier andere beroepen toe met hun bijbehorende vragen
    };

    const question = questions[job][Math.floor(Math.random() * questions[job].length)];
    const answers = [question.correctAnswer, ...question.incorrectAnswers];
    const salary = jobs[job][0].salary;
    answers.sort(() => Math.random() - 0.5);

    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('answer_1')
      .setLabel(answers[0])
      .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
      .setCustomId('answer_2')
      .setLabel(answers[1])
      .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
      .setCustomId('answer_3')
      .setLabel(answers[2])
      .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
      .setCustomId('answer_4')
      .setLabel(answers[3])
      .setStyle(ButtonStyle.Secondary)
    );

    const questionEmbed = new EmbedBuilder()
    .setAuthor({ name: user.displayName, iconURL: user.avatarURL({ dynamic: true }) })
    .setTitle(jobs[job][0].name)
    .setColor('#2C2F33')
    .setDescription(`**${question.question}**\n\nAnswer the question correctly to earn \`${salary}\` 🪙`)
    .setFooter({ text: 'You have 30 seconds to answer the question' })

    const questionEmbedCorrect = new EmbedBuilder()
    .setAuthor({ name: user.displayName, iconURL: user.avatarURL({ dynamic: true }) })
    .setTitle(jobs[job][0].name)
    .setColor('#3ba55c')
    .setDescription(`**${question.question}**\n\nYou answered the question correctly and received your paycheck of \`${salary}\` 🪙`)

    const questionEmbedIncorrect = new EmbedBuilder()
    .setAuthor({ name: user.displayName, iconURL: user.avatarURL({ dynamic: true }) })
    .setTitle(jobs[job][0].name)
    .setColor('#ed4245')
    .setDescription(`**${question.question}**\n\nYou didn't answer the question correctly. You only received \`${salary / 2}\` 🪙`)

    const questionEmbedTime = new EmbedBuilder()
    .setAuthor({ name: user.displayName, iconURL: user.avatarURL({ dynamic: true }) })
    .setTitle(jobs[job][0].name)
    .setColor('#5865f2')
    .setDescription(`**${question.question}**\n\nYou didn't answer the question in time. You didn't receive any money.`)

    const work = await interaction.editReply({ embeds: [questionEmbed], components: [row] });

    const collectorFilter = i => i.user.id === user.id;

    const timeRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('trivia_1')
        .setLabel(answers[0])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId('trivia_2')
        .setLabel(answers[1])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId('trivia_3')
        .setLabel(answers[2])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId('trivia_4')
        .setLabel(answers[3])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    try {
      const answer = await work.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
      const correctAnswer = question.correctAnswer;
      const correctButtonIndex = answers.indexOf(correctAnswer) + 1;
      const clickedButtonIndex = parseInt(answer.customId.split('_')[1]);

      const newButtons = [
        new ButtonBuilder()
          .setCustomId('trivia_1')
          .setLabel(answers[0])
          .setStyle(correctButtonIndex === 1 ? ButtonStyle.Success : clickedButtonIndex === 1 ? ButtonStyle.Danger : ButtonStyle.Secondary)
          .setDisabled(true),
      
        new ButtonBuilder()
          .setCustomId('trivia_2')
          .setLabel(answers[1])
          .setStyle(correctButtonIndex === 2 ? ButtonStyle.Success : clickedButtonIndex === 2 ? ButtonStyle.Danger : ButtonStyle.Secondary)
          .setDisabled(true),
      
        new ButtonBuilder()
          .setCustomId('trivia_3')
          .setLabel(answers[2])
          .setStyle(correctButtonIndex === 3 ? ButtonStyle.Success : clickedButtonIndex === 3 ? ButtonStyle.Danger : ButtonStyle.Secondary)
          .setDisabled(true),
      
        new ButtonBuilder()
          .setCustomId('trivia_4')
          .setLabel(answers[3])
          .setStyle(correctButtonIndex === 4 ? ButtonStyle.Success : clickedButtonIndex === 4 ? ButtonStyle.Danger : ButtonStyle.Secondary)
          .setDisabled(true),
      ];

      const newRow = new ActionRowBuilder().addComponents(...newButtons);

      if (answer.customId === 'answer_' + correctButtonIndex.toString()) {
        try {
          await addBalance(user.id, salary);
        } catch (error) {
          console.log(error);
        }
        await answer.update({ components: [newRow], embeds: [questionEmbedCorrect] });
      } else {
        await addBalance(user.id, salary / 2);
        await answer.update({ components: [newRow], embeds: [questionEmbedIncorrect] });
      }
    } catch (error) {
      try {
        await interaction.editReply({ embeds: [questionEmbedTime], components: [timeRow] });
      } catch (error) {
        console.log('Error while trying to edit the reply: ', error)
      }
    }
  },
};