const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show the current queue.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
    const currentTrack = queue.currentTrack; //Gets the current track being played

    console.log(tracks);
    console.log(currentTrack);

    await interaction.reply(tracks);
  },
};
