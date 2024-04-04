const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play a game of blackjack.')
    .addIntegerOption(option => 
        option.setName('bet')
        .setDescription('Place your bet for the blackjack game. (Min. 100, Max. 20,000)')
        .setMinValue(100)
        .setMaxValue(100000)
        .setRequired(true)),
  async execute(interaction) {
    const { getBalance, addBalance } = require('../index');
    const balance = getBalance(interaction.user.id);
	const bet = interaction.options.getInteger('bet');
    const betTxt = bet.toLocaleString();

	if (bet > balance) {
        return interaction.reply({ content: `Sorry, but you only have \`${balance}\` 🪙.`, ephemeral: true });
    }

    // Withdraw the bet from the player's balance
    addBalance(interaction.user.id, -bet)

    // Deck of cards
    const deck = [
        '2 ♥️', '3 ♥️', '4 ♥️', '5 ♥️', '6 ♥️', '7 ♥️', '8 ♥️', '9 ♥️', '10 ♥️', 'J ♥️', 'Q ♥️', 'K ♥️', 'A ♥️',
        '2 ♠️', '3 ♠️', '4 ♠️', '5 ♠️', '6 ♠️', '7 ♠️', '8 ♠️', '9 ♠️', '10 ♠️', 'J ♠️', 'Q ♠️', 'K ♠️', 'A ♠️',
        '2 ♦️', '3 ♦️', '4 ♦️', '5 ♦️', '6 ♦️', '7 ♦️', '8 ♦️', '9 ♦️', '10 ♦️', 'J ♦️', 'Q ♦️', 'K ♦️', 'A ♦️',
        '2 ♣️', '3 ♣️', '4 ♣️', '5 ♣️', '6 ♣️', '7 ♣️', '8 ♣️', '9 ♣️', '10 ♣️', 'J ♣️', 'Q ♣️', 'K ♣️', 'A ♣️'
    ];

    // Function to draw a random card from the deck
    function drawCard() {
        const index = Math.floor(Math.random() * deck.length);
        return deck.splice(index, 1)[0];
    }

    // Function to declare the value of a card
    function cardValue(card) {
        if (card.includes('A') || card.includes('J') || card.includes('Q') || card.includes('K')) {
            return card.includes('A') ? 11 : 10; // Aas wordt 11 of 1, andere plaatjes zijn 10
        } else {
            return parseInt(card);
        }
    }

    // Function to calculate the value of a hand
    function handValue(hand) {
        let sum = 0;
        let aceCount = 0;
    
        for (const card of hand) {
            const value = cardValue(card);
            sum += value;
            if (card.includes('A')) {
                aceCount++;
            }
        }
    
        // Change the value of the ace
        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }
    
        return sum;
    }
        const playerHand = [drawCard(), drawCard()];
        const dealerHand = [drawCard(), drawCard()];

        // Start the game
        const shuffleEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
        .setColor('#2C2F33')
        .setTitle('🔀 Shuffling the deck...')
        .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

        await interaction.reply({ embeds: [shuffleEmbed] });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Draw the first cards
        const firstDrawEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
        .setColor('#2C2F33')
        .setTitle(`Your cards [${handValue(playerHand).toString()}]`)
        .setDescription(`
        **${playerHand.join('** and **')}**
        \u200B
        `)
        .addFields(
            {name: `🕵️ Dealer's hand`, value: `**${dealerHand[0].toString()}** and ❓`}
        )
        .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('hit')
            .setEmoji('🙋')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
              .setCustomId('stand')
              .setEmoji('🙅')
              .setLabel('Stand')
              .setStyle(ButtonStyle.Danger)
        );

        const disableRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('hit')
            .setEmoji('🙋')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
              .setCustomId('stand')
              .setEmoji('🙅')
              .setLabel('Stand')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
        );

        const decisionMessage = await interaction.editReply({ embeds: [firstDrawEmbed] });

    // Function to check if the hand has blackjack
    function hasBlackjack(hand) {
        return hand.length === 2 && handValue(hand) === 21;
    }

    // Check if they player got blackjack
    if (hasBlackjack(playerHand)) {
        // Check if the dealer has blackjack
        if (hasBlackjack(dealerHand)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Both got blackjack, it's a tie
            const dealerEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setColor('#2C2F33')
            .setTitle(`Your cards [${handValue(playerHand).toString()}]`)
            .setDescription(`
            **${playerHand.join('** and **')}**
            \u200B
            `)
            .addFields(
                {name: `🕵️ Dealer's hand`, value: `**${dealerHand.join('** and **')}**`}
            )
            .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

            addBalance(interaction.user.id, bet)
            return decisionMessage.edit({ content: `**😥 Oh no!** It's a tie with blackjack.\nAdded back your bet of \`${betTxt}\` 🪙 to your balance.`, embeds: [dealerEmbed], components: [] })
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Player got blackjack, dealer doesn't
            const bjPay = Math.round(bet * 2.5);
            const bjPayout = bjPay.toLocaleString();

            const bjEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setColor('#FEE75C')
            .setTitle(`Your cards [${handValue(playerHand).toString()}]`)
            .setDescription(`
            **${playerHand.join('** and **')}**
            \u200B
            `)
            .addFields(
                {name: `🕵️ Dealer's hand`, value: `**${dealerHand.join('** and **')}**`}
            )
            .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

            addBalance(interaction.user.id, bjPay);
            return decisionMessage.edit({ content: `**👑 BLACKJACK!** Congratulations, you've won with blackjack!\nAdded \`${bjPayout}\` 🪙 to your balance.`, embeds: [bjEmbed] });
        }
    }
    
        // Player takes card until they go bust or decide to stand
        await decisionMessage.edit({ components: [row] })

        try {
            const collectorFilter = i => i.user.id === interaction.user.id;

            while (handValue(playerHand) < 21) {
                const decision = await decisionMessage.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                if (decision.customId === 'hit') {
                    const card = drawCard();
                    playerHand.push(card);

                    const hitEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
                    .setColor('#2C2F33')
                    .setTitle(`Your cards [${handValue(playerHand) <= 21 ? handValue(playerHand).toString() : 'BUST'}]`)
                    .setDescription(`
                    **${playerHand.join('**, **')}**
                    \u200B
                    `)
                    .addFields(
                        {name: `🕵️ Dealer's hand`, value: `**${dealerHand[0].toString()}** and ❓`}
                    )
                    .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

                    decision.update({ embeds: [hitEmbed] })   
                } else if (decision.customId === 'stand') { 
                    decision.update({ components: [disableRow] });
                    break;
                }
            }          
        } catch (error) {
            return interaction.editReply({ content: '⏱️ **You lost!** Failed to respond within 60 seconds.', components: [disableRow] });
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const dealerCardEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
        .setColor('#2C2F33')
        .setTitle(`Your cards [${handValue(playerHand) <= 21 ? handValue(playerHand).toString() : 'BUST'}]`)
        .setDescription(`
        **${playerHand.join('**, **')}**
        \u200B
        `)
        .addFields(
            {name: `🕵️ Dealer's hand [${handValue(dealerHand) <= 21 ? handValue(dealerHand).toString() : 'BUST'}]`, value: `**${dealerHand.join('** and **')}**`}
        )
        .setFooter({ text: `Placed bets: ${betTxt} 🪙`})

        await decisionMessage.edit({ embeds: [dealerCardEmbed], components: [] })

        // Dealer draws cards until he reaches 17
        while (handValue(dealerHand) < 17) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const card = drawCard();
            dealerHand.push(card);

            const dealerEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Blackjack', iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setColor('#2C2F33')
            .setTitle(`Your cards [${handValue(playerHand) <= 21 ? handValue(playerHand).toString() : 'BUST'}]`)
            .setDescription(`
            **${playerHand.join('**, **')}**
            \u200B
            `)
            .addFields(
                {name: `🕵️ Dealer's hand [${handValue(dealerHand) <= 21 ? handValue(dealerHand).toString() : 'BUST'}]`, value: `**${dealerHand.join('**, **')}**`}
            )
            .setFooter({ text: `Placed bets: ${betTxt} 🪙`})
    
            await decisionMessage.edit({ embeds: [dealerEmbed], components: [] })
        }
    
        // Decide the winner
        const playerValue = handValue(playerHand);
        const dealerValue = handValue(dealerHand);

        await new Promise(resolve => setTimeout(resolve, 2000));
        const reward = bet * 2;
    
        if (playerValue > 21) {
            decisionMessage.edit({ content: `😢 **You lost!** You've gone bust, the dealer wins.\nRemoved \`${betTxt}\` 🪙 from your balance.`})
        } else if (dealerValue > 21 || playerValue > dealerValue) {
            addBalance(interaction.user.id, reward)
            decisionMessage.edit({ content: `🎉 **You won!**\nAdded \`${reward.toLocaleString()}\` 🪙 to your balance.`})
        } else if (playerValue < dealerValue) {
            decisionMessage.edit({ content: `😢 **You lost!** The dealer wins.\nRemoved \`${betTxt}\` 🪙 from your balance.`})
        } else {
            addBalance(interaction.user.id, bet)
            decisionMessage.edit({ content: `⚖️ **It's a tie!**\nAdded back your bet of \`${betTxt}\` 🪙 to your balance.`})
        }
  },
};