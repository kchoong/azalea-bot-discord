const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current track.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const skippedTrack = queue.currentTrack; //Gets the current track being played
    queue.node.skip();

    await interaction.reply('Skipped the current song!');
    await interaction.deleteReply();
  },
};
