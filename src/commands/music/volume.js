const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the volume of the music.')
    .addIntegerOption((option) =>
      option
        .setName('level')
        .setDescription('The volume level you want to set.')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const volume = interaction.options.getInteger('level');
    queue.node.setVolume(volume);

    await interaction.reply('Volume has been set to ' + volume + '.');
  },
};
