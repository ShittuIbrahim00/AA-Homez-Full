// import ModelCommission from '../models/model.commission.js';
// import ModelCommissionSplit from '../models/model.commissionSplit.js';
// import ModelAgent from '../models/model.agent.js';

// class CommissionService {
//   static async createCommission(propertyId, agentId, amount) {
//     const commission = await ModelCommission.create({
//       propertyId,
//       agentId,
//       transactionAmount: amount
//     });

//     // Update agent's sales portfolio
//     await ModelAgent.increment('salesPortfolio', {
//       by: amount,
//       where: { aid: agentId }
//     });

//     // Distribute referral commission
//     await this.distributeReferralCommission(agentId, commission.cid, commission.referralCommission);

//     return commission;
//   }

//   static async distributeReferralCommission(agentId, commissionId, totalAmount) {
//     const agent = await ModelAgent.findByPk(agentId, {
//       include: [{
//         model: ModelAgent,
//         as: 'referrals'
//       }]
//     });

//     if (!agent.referrals || agent.referrals.length === 0) return;

//     const splitAmount = totalAmount / agent.referrals.length;

//     for (const referral of agent.referrals) {
//       await ModelCommissionSplit.create({
//         commissionId,
//         agentId: referral.aid,
//         amount: splitAmount,
//         level: 1
//       });

//       // Update referral agent's earnings
//       await ModelAgent.increment('referralEarnings', {
//         by: splitAmount,
//         where: { aid: referral.aid }
//       });
//     }
//   }

//   static async getAgentCommissions(agentId) {
//     return ModelCommission.findAll({
//       where: { agentId },
//       include: [{
//         model: ModelCommissionSplit,
//         as: 'splits'
//       }]
//     });
//   }
// }

// export default CommissionService;