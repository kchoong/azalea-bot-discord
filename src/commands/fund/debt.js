const {
  SlashCommandBuilder,
  EmbedBuilder,
  UserSelectMenuBuilder,
  ActionRowBuilder,
} = require('discord.js');
const {FundsDao} = require('../../helpers/fundsDao');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debt')
    .setDescription('Add a selected amount of debts for one or multiple users.')
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of debts to add.')
        .setMinValue(0.01)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for adding the debts.').setRequired(false)
    ),
  async execute(interaction) {
    const amount = interaction.options.getNumber('amount', true);
    const reason = interaction.options.getString('reason', false);
    const userSelect = new UserSelectMenuBuilder()
      .setCustomId('users')
      .setDefaultUsers.setPlaceholder('Select one or multiple users.')
      .setMinValues(1)
      .setMaxValues(25);

    const actionRow = new ActionRowBuilder().addComponents(userSelect);

    const selectedUsers = await interaction.reply({
      content: `Select one or multiple users to add ${amount}€ of funds to:`,
      components: [actionRow],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;
    let selection;
    try {
      selection = await selectedUsers.awaitMessageComponent({
        filter: collectorFilter,
        time: 600_000,
      });
      await selection.update({
        content: `Adding ${amount}€ of funds for the selected users...`,
        components: [],
      });
    } catch (e) {
      await interaction.followUp({
        content: 'Confirmation not received within 10 minutes, cancelling.',
        components: [],
      });
    }

    if (!selection) return;

    const result = [];
    const guildMembers = await interaction.guild.members.fetch();
    const selectedGuildMembers = guildMembers.filter((member) =>
      selection.values.includes(member.id)
    );
    for (let guildMemberResult of selectedGuildMembers) {
      let member = guildMemberResult[1];
      let userId = member.user.id;
      let displayName = member.nickname || member.user.username;
      await FundsDao.addFund(userId, amount, reason);
      let userFund = await FundsDao.getTotalFundForUser(userId);
      result.push({
        name: displayName,
        total: userFund,
      });
    }

    const totalFunds = await FundsDao.getTotalFunds();
    const currentFundForSelectedUsers = result.map((user) => `- ${user.name}`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(`#${process.env.ACCENT_COLOR}`)
      .setTitle(`Adding funds: ${amount}€`)
      .setDescription(currentFundForSelectedUsers)
      .addFields({name: 'Current Total', value: `${totalFunds}€`});
    await interaction.followUp({embeds: [embed]});
  },
};
