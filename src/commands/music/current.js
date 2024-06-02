const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('current')
    .setDescription('Show the currently played track.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); // Tracks in the queue, excluding the current track
    const currentTrack = queue.currentTrack;

    await interaction.reply(tracks);
  },
};
