const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pause or resume the music.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    queue.node.setPaused(!queue.node.isPaused()); // isPaused() returns true if that player is already paused

    await interaction.reply('Paused the music!');
    await interaction.deleteReply();
  },
};
