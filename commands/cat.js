const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat!'),
  async execute(interaction) {
    const axios = require('axios');
    let url = 'https://api.thecatapi.com/v1/images/search?api_key=live_PS8GtLDPZBRwUA0HNpqhomsy5gzW8xeH7C3zTKWXes8D6TJiwYcFcpy7OUhDR9sM';

    try {
        const response = await axios.get(url);
        const cat = response.data[0];
        let breeds = cat.breeds[0];

        if (breeds == undefined) {
          const embed = new EmbedBuilder()
          .setTitle("🐱 Random cat")
          .setColor('#2C2F33')
          .setDescription("No breed information available!")
          .setImage(cat.url)
          .setTimestamp();
  
          interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
          .setTitle("🐱 Random cat")
          .setDescription(`
          🐈 **BREED** ${breeds.name}
          🌎 **ORIGIN** ${breeds.origin}
          🧓 **LIFE SPAN** ${breeds.life_span} years
          ⚖️ **WEIGHT** ${breeds.weight.metric} kg

          🧬 **TEMPERAMENT** 
          ${breeds.temperament}

          📝 **DESCRIPTION**
          ${breeds.description}
          `)
          .setImage(cat.url)
          .setTimestamp();
  
          interaction.reply({ embeds: [embed] });
        }
    } catch (error) {
        console.log("Error: " + error);
        interaction.reply("There was an error while fetching the cat API.")
    }
  },
};