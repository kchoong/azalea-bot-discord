const {SlashCommandBuilder} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Set the repeat mode for the queue.')
    .addIntegerOption((option) =>
      option
        .setName('mode')
        .setDescription('The repeat mode for the queue.')
        .setRequired(true)
        .addChoices(
          {name: 'Off', value: 0},
          {name: 'Track', value: 1},
          {name: 'Queue', value: 2},
          {name: 'Autoplay', value: 3}
        )
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const mode = interaction.options.getInteger('mode');
    queue.setRepeatMode(mode);

    await interaction.reply('Repeat mode has been set to ' + mode + '.');
  },
};
