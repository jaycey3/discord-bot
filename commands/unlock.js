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
        const { getAllSettings, getSetting, unlockSetting, getAllUnlockedSettings } = require('../sql/settingsQueries');
        const { getUser } = require('../sql/userQueries');
        const { addBalance } = require('../sql/economyQueries');
        const target = interaction.user;
        const user = await getUser(target.id);
        const unlockedSettings = await getAllUnlockedSettings(target.id);
        const settings = await getAllSettings();

        if (interaction.options.getSubcommand() === 'color') {
            await interaction.deferReply();

            let colorsToUnlock = [];
            const unlockedSettingIds = unlockedSettings.map(setting => setting.setting_id);

            for (let setting of settings) {
                if (setting.type === 'level_color' && !unlockedSettingIds.includes(setting.id)) {
                    colorsToUnlock.push(setting);
                }
            }

            const select = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Please select color to unlock.');

            for (let color of colorsToUnlock) {
                const { id: id, name: name, price: price } = await getSetting(color.id);
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(name)
                        .setDescription(`Cost: ${price.toLocaleString()} 🪙`)
                        .setValue(id.toString()),
                );
            }

            const row = new ActionRowBuilder()
                .addComponents(select);

            const embed = new EmbedBuilder()
                .setTitle('🎨 Colors to unlock')
                .setColor('#2C2F33')
                .setDescription(`This is a list of all available colors. Please select the color you want to unlock using the select menu below.\n\nYou have \`1 minute\` to select a color.`);

            const colorList = await interaction.editReply({ embeds: [embed], components: [row] });

            const collectorFilter = i => i.user.id === target.id;

            try {
                const selection = await colorList.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                const color = selection.values[0];

                const { id: id, name: name, price: price } = await getSetting(color);
                const balance = user.balance;

                if (price > balance) {
                    interaction.deleteReply();
                    return selection.reply({ content: `⚠️ **You do not have enough 🪙 to unlock ${name}!**`, ephemeral: true, });
                } else {
                    await addBalance(target.id, -price);
                    await unlockSetting(target.id, id);
                    const unlockedEmbed = new EmbedBuilder()
                        .setTitle('🎉 Color Unlocked')
                        .setColor('#2C2F33')
                        .setDescription(`Congratulations, **${target.displayName}**! You have unlocked the color **${name}**!`)
                        .setFooter({ text: 'You can now use this color in your /settings.' });

                    await selection.update({ embeds: [unlockedEmbed], components: [] });
                }
            } catch (e) {
                await interaction.editReply({ content: '⏰ **No color was selected within 1 minutes.**', components: [], embeds: [], ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === 'background') {
            await interaction.deferReply();

            let backgroundsToUnlock = [];
            const unlockedSettingIds = unlockedSettings.map(setting => setting.setting_id);

            for (let setting of settings) {
                if (setting.type === 'level_bg' && !unlockedSettingIds.includes(setting.id)) {
                    backgroundsToUnlock.push(setting);
                }
            }

            const select = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Please select background to unlock.');

            for (let background of backgroundsToUnlock) {
                const { id: id, name: name, price: price } = await getSetting(background.id);
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(name)
                        .setDescription(`Cost: ${price.toLocaleString()} 🪙`)
                        .setValue(id.toString()),
                );
            }

            const row = new ActionRowBuilder()
                .addComponents(select);

            const embed = new EmbedBuilder()
                .setTitle('🖼️ Backgrounds to unlock')
                .setColor('#2C2F33')
                .setDescription(`This is a list of all available backgrounds. Please select the background you want to unlock using the select menu below.\n\nYou have \`1 minute\` to select a background.`);

            const bgList = await interaction.editReply({ embeds: [embed], components: [row] });

            const collectorFilter = i => i.user.id === target.id;

            try {
                const selection = await bgList.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                const background = selection.values[0];

                const { id: id, name: name, price: price } = await getSetting(background);
                const balance = user.balance;

                if (price > balance) {
                    interaction.deleteReply();
                    return selection.reply({ content: `⚠️ **You do not have enough 🪙 to unlock ${name}!**`, ephemeral: true, });
                } else {
                    await addBalance(target.id, -price);
                    await unlockSetting(target.id, id);
                    const unlockedEmbed = new EmbedBuilder()
                        .setTitle('🎉 Background Unlocked')
                        .setColor('#2C2F33')
                        .setDescription(`Congratulations, **${target.displayName}**! You have unlocked the **${name}** background!`)
                        .setFooter({ text: 'You can now use this background in your /settings.' });

                    await selection.update({ embeds: [unlockedEmbed], components: [] });
                }
            } catch (e) {
                await interaction.editReply({ content: '⏰ **No background was selected within 1 minutes.**', components: [], embeds: [], ephemeral: true });
            }
        }
    },
};