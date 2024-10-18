const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});
const Funds = require('../models/Funds.js')(sequelize, Sequelize.DataTypes);

const FundsDao = {
  addFund: async (user_id, amount, reason) => {
    return Funds.create({user_id: user_id, amount: amount, reason: reason});
  },
  payoutFunds: async (user_id) => {
    return Funds.update({payout: true}, {where: {user_id: user_id, payout: false}});
  },
  getTotalFundForUser: async (user_id) => {
    return Funds.sum('amount', {where: {user_id: user_id, payout: false}});
  },
  getTotalFundForAllUsers: async () => {
    return Funds.findAll({
      attributes: ['user_id', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
      where: {payout: false},
      group: 'user_id',
      order: [['total', 'DESC']],
    });
  },
  getTotalFunds: async () => {
    return Funds.sum('amount', {where: {payout: false}});
  },
};

module.exports = {FundsDao};
