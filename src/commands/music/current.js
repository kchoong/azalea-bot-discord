const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('current')
    .setDescription('Show the currently played track.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const currentTrack = queue.currentTrack;

    const embed = new EmbedBuilder()
      .setColor(`#${process.env.ACCENT_COLOR}`)
      .setTitle(currentTrack.title)
      .setURL(currentTrack.url)
      .setThumbnail(currentTrack.thumbnail)
      .addFields(
        {name: 'Artist', value: currentTrack.author, inline: true},
        {name: 'Duration', value: currentTrack.duration, inline: true}
      );

    interaction.reply({embeds: [embed]});
  },
};
