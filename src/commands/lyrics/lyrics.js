const {SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('lyrics').setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
