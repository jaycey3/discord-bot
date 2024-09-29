const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin to double your bet. (Red or Blue)')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('Place your bet for the coin flip game. (Min. 100, Max. 50,000)')
                .setMinValue(100)
                .setMaxValue(50000)
                .setRequired(true)),
    async execute(interaction) {
        const { addBalance } = require('../sql/economyQueries');
        const { getUser } = require('../sql/userQueries');
        const user_id = interaction.user.id;
        const user = await getUser(user_id);
        const balance = user.balance;
        const bet = interaction.options.getInteger('bet');
        const betTxt = bet.toLocaleString();

        if (bet > balance) {
            return interaction.reply({ content: `⚠️ **Sorry, but you only have \`${balance}\` 🪙.**`, ephemeral: true });
        }

        addBalance(user_id, -bet)

        const redOrBlueEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Coin Flip', iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor('#2C2F33')
            .setTitle('What do you want to bet on?')
            .setFooter({ text: `Placed bets: ${betTxt} 🪙` })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('red')
                    .setEmoji('🔴')
                    .setLabel('RED')
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('blue')
                    .setEmoji('🔵')
                    .setLabel('BLUE')
                    .setStyle(ButtonStyle.Secondary)
            );

        const choice = await interaction.reply({ embeds: [redOrBlueEmbed], components: [row] });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const decision = await choice.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            const flippingEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Coin Flip', iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setColor('#2C2F33')
            .setTitle('🔄 Flipping the coin...')
            .setFooter({ text: `Placed bets: ${betTxt} 🪙 | Choice: ${decision.customId === 'red' ? '🔴 RED' : '🔵 BLUE'}`})

            const flipping =  await choice.edit({ embeds: [flippingEmbed], components: [] })

            await new Promise(resolve => setTimeout(resolve, 3000));

            const outcome = Math.random() < 0.5 ? 'red' : 'blue';

            const resultEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Coin Flip', iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setColor(outcome === 'red' ? '#dd2e44' : '#55acee')
            .setTitle(`The coin landed on`)
            .setDescription(outcome === 'red' ? '**🔴 RED**' : '**🔵 BLUE**')
            .setFooter({ text: `Placed bets: ${betTxt} 🪙 | Choice: ${decision.customId === 'red' ? '🔴 RED' : '🔵 BLUE'}`})

            const reward = bet * 2;

            if (decision.customId === 'red' && outcome === 'red' || decision.customId === 'blue' && outcome === 'blue') {
                addBalance(user_id, reward)
                flipping.edit({ content: `🎉 **You won!**\nAdded \`${reward.toLocaleString()}\` 🪙 to your balance.`, embeds: [resultEmbed] })
            } else {
                flipping.edit({ content: `😢 **You lost!**\nRemoved \`${betTxt}\` 🪙 from your balance.`, embeds: [resultEmbed] })
            }
        } catch (e) {
            await interaction.editReply({ content: '⏱️ **You lost!** Failed to respond within 60 seconds.', components: [] });
        }


    },
};