const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useMainPlayer, useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play or enqueue a song from YouTube or Spotify.')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The URL or search query for the YouTube video/playlist or Spotify song.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const player = useMainPlayer();
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('Please join a voice channel first!');
    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    try {
      const {track} = await player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
        },
      });

      const queue = useQueue(interaction.guild.id);
      if (queue.tracks === null || queue.tracks.size === 0) {
        await interaction.followUp({
          content: `\u25B6 Now playing: ${track.title}`,
          ephemeral: true,
        });
        return interaction.deleteReply();
      }

      const embed = new EmbedBuilder()
        .setColor(`#${process.env.ACCENT_COLOR}`)
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setDescription('has been added to the queue.')
        .addFields(
          {name: 'Artist', value: track.author, inline: true},
          {name: 'Duration', value: track.duration, inline: true}
        );

      await interaction.followUp({embeds: [embed]});
    } catch (e) {
      console.error(`Error adding the URL or query: ${query}`);
      console.error(`Error: ${e}`);
      return interaction.followUp(`Something went wrong, please try another URL or query.`);
    }
  },
};
