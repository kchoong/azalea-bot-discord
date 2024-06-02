const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current list of tracks in the queue.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); // Tracks in the queue, excluding the current track
    if (!tracks.length)
      return interaction.reply('The current queue is empty! Try adding some tracks with `/play`.');

    const firstTen = tracks.length > 10 ? tracks.slice(0, 10) : tracks;
    const description = firstTen
      .map((track, index) => `${index + 1}. [${track.title}](${track.url})`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(`#${process.env.ACCENT_COLOR}`)
      .setTitle('Current Queue')
      .setDescription(description)
      .addFields({name: 'Total', value: `${tracks.length}`, inline: true});

    await interaction.reply({embeds: [embed]});
  },
};
