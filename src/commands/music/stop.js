const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and disconnect the bot.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    queue.delete();

    await interaction.reply('Stopped the music!');
    await interaction.deleteReply();
  },
};
