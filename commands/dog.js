const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Get a random dog!'),
  async execute(interaction) {
    const axios = require('axios');
    let url = 'https://api.thedogapi.com/v1/images/search?api_key=live_kGCSdWvsz1qj6DdXTOLTuzIDjtWLtDPVTd3ZVYQ91F1Dh44NZl9Vbn9XtJcl5F1r';

    try {
        const response = await axios.get(url);
        const dog = response.data[0];
        let breeds = dog.breeds[0];

        if (breeds == undefined) {
          const embed = new EmbedBuilder()
          .setTitle("🐶 Random dog")
          .setColor('#2C2F33')
          .setDescription("No breed information available!")
          .setImage(dog.url)
          .setTimestamp();
  
          interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
          .setTitle("🐶 Random dog")
          .setDescription(`
          🐕 **BREED** ${breeds.name}
          🐕‍🦺 **BRED FOR** ${breeds.bred_for}
          🧓 **LIFE SPAN** ${breeds.life_span}
          ⚖️ **WEIGHT** ${breeds.weight.metric} kg
          📏 **HEIGHT** ${breeds.height.metric} cm

          🧬 **TEMPERAMENT** 
          ${breeds.temperament}
          `)
          .setImage(dog.url)
          .setTimestamp();
  
          interaction.reply({ embeds: [embed] });
        }
    } catch (error) {
        console.log("Error: " + error);
        interaction.reply("There was an error while fetching the dog API.")
    }
  },
};