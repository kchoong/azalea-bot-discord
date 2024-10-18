const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {FundsDao} = require('../../helpers/fundsDao');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payout')
    .setDescription('Payout funds for a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user, who paid with their funds.')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of fund to payout.')
        .setMinValue(0.01)
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const amount = interaction.options.getNumber('amount', true);

    const userFund = await FundsDao.getTotalFundForUser(user.id);
    const remainingFunds = userFund - amount;

    const guildMembers = await interaction.guild.members.fetch();
    const guildMember = guildMembers.find((member) => member.id === user.id);
    const displayName = guildMember
      ? guildMember.nickname || guildMember.user.username
      : user.username;
    const embed = new EmbedBuilder()
      .setColor(`#${process.env.ACCENT_COLOR}`)
      .setTitle(`Paying out ${amount}€ for ${member.user.username}`)
      .setDescription(currentFundForSelectedUsers)
      .addFields({name: 'Remaining Funds', value: `${remainingFunds}€`});
    await interaction.followUp({embeds: [embed]});
  },
};
