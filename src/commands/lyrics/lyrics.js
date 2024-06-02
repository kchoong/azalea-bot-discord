const {SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription(
      'Fetch and optionally translate the lyrics of the current track or a specified track in the query.'
    )
    .addStringOption((option) =>
      option.setName('query').setDescription('Specify a song name and artist to search for lyrics.')
    )
    .addIntegerOption((option) =>
      option
        .setName('translate')
        .setDescription('Enable AI-supported translation of the lyrics.')
        .addChoices({name: 'Disable', value: 0}, {name: 'Enable', value: 1})
    ),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
