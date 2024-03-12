const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const YouTube = require('youtube-sr').default;
const play = require('play-dl');

const queues = new Map();

module.exports = {
	queues: queues,
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option => 
      option.setName('song')
      .setDescription('Search for a song or give me an URL')
      .setRequired(true)),
  async execute(interaction) {
    const keywords = interaction.options.getString('song');

    if (!interaction.member.voice.channel) {
      interaction.reply({ content: '⚠️ You have to be in a voice channel to use this command.', ephemeral: true })
      return;
    }

		async function getSong(search) {
			let song; 
			const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?$/;
			const isURL = urlRegex.test(keywords);
			if (isURL) {
				 song = await YouTube.getVideo(search);
			 } else {
				 song = await YouTube.searchOne(search);
			 }
			return {
				url: song.url,
				title: song.title,
				thumbnailURL: song.thumbnail.url
			};
		}

    const voiceChannelId = interaction.member.voice.channel.id;
		const textChannel = interaction.channel;
    const guildId = interaction.guild.id;
    let queue = queues.get(guildId);

    if (!queue) {
      const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: interaction.channel.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play
        }
      });

      connection.on('stateChange', (oldState, newState) => {
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
      });

      player.on('stateChange', async (oldState, newState) => {

        if (newState.status === 'idle') {
					console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
          if (queue.songs.length > 0) {
            const nextSong = queue.songs.shift();
            const stream = await play.stream(nextSong);
            const resource = createAudioResource(stream.stream, {
              inputType: stream.type
            });

						const nextResult = await getSong(nextSong);

						const nowPlayingEmbed = new EmbedBuilder()
						.setAuthor({ name: 'Now playing from queue' })
            .setColor('#2C2F33')
						.setTitle(`🎶 ${nextResult.title}`)
						.setURL(nextResult.url)
						.setThumbnail(nextResult.thumbnailURL);

						textChannel.send({ embeds: [nowPlayingEmbed] })
            player.play(resource);
          } else {
						queue.playing = false;

						const queueEmptyEmbed = new EmbedBuilder()
						.setTitle(`🚫 Queue is empty. Stopping...`)

						textChannel.send({ embeds: [queueEmptyEmbed] })
					}
        } else {
					console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
				}
      });

      queue = {
        voiceChannel: interaction.member.voice.channel,
        textChannel: interaction.channel,
        connection: connection,
        player: player,
        songs: [],
        playing: false
      };

      queues.set(guildId, queue);
    }

    try {
      const result = await getSong(keywords);

      if (!queue.playing) {
        const stream = await play.stream(result.url);
        const resource = createAudioResource(stream.stream, {
          inputType: stream.type
        });

        queue.player.play(resource);
        queue.connection.subscribe(queue.player);
        queue.playing = true;

        const nowPlayingEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Now playing', iconURL: interaction.member.user.avatarURL({ dynamic: true })})
          .setColor('#2C2F33')
          .setTitle(`🔊 ${result.title}`)
          .setURL(result.url)
          .setThumbnail(result.thumbnailURL);

        await interaction.reply({ embeds: [nowPlayingEmbed] });
      } else {
        queue.songs.push(result.url);
        const addedEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Added to queue', iconURL: interaction.member.user.avatarURL({ dynamic: true })})
          .setColor('#2C2F33')
          .setTitle(`✅ ${result.title}`)
          .setURL(result.url)
          .setThumbnail(result.thumbnailURL);

        await interaction.reply({ embeds: [addedEmbed] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};