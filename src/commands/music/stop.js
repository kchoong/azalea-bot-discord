const {SlashCommandBuilder, ActivityType} = require('discord.js');
const {useQueue} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and disconnect the bot.'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    queue.delete();

    interaction.client.user.setActivity('🌸', {type: ActivityType.Custom});

    await interaction.reply({content: 'Stopped the music!', ephemeral: true});
    await interaction.deleteReply();
  },
};
