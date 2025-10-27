import {
  ModelAgent,
} from "../models/index.js";


/**
 * Slantapp code and properties {www.slantapp.io}
 */

/**
 *
 * @param aid = agent ID
 * @param uid = agency/user ID
 * @param pid = property ID
 * @param spid = sub-property ID
 * @param amount = amount property was sold for
 * @returns {Promise<void>}
 */
// export const transactionLogic = async (aid, uid, pid, spid, amount) => {
//   const property = await ModelProperty.findOne({ where: { pid } });
//   const subProperty = await ModelSubProperty.findOne({ where: { sid: spid } });

//   const agentTrx = {
//     aid,
//     uid,
//     pid,
//     spid,
//     amount,
//     actualAmount: subProperty.price,
//     role: "agent",
//     service: "sale",
//     type: "credit",
//     status: "successful",
//   };
//   await ModelTransaction.create(agentTrx);

//   const agencyTrx = {
//     aid,
//     uid,
//     pid,
//     spid,
//     amount,
//     actualAmount: subProperty.price,
//     role: "agency",
//     service: "sale",
//     type: "credit",
//     status: "successful",
//   };
//   await ModelTransaction.create(agentTrx);
// };

const AGENCY_COMMISSION_RATE = 0.05;
const REFERRAL_COMMISSION_RATE = 0.05;

async function getFullReferralChain(agentId, chain = []) {
  const agent = await ModelAgent.findByPk(agentId);
  if (!agent || !agent.referred_by) return chain;
  
  const referrer = await ModelAgent.findByPk(agent.referred_by);
  if (!referrer) return chain;
  
  chain.push(referrer);
  return getFullReferralChain(referrer.aid, chain);
}

export const calculateClubReward = async (agentId, amount) => {
  const agent = await ModelAgent.findByPk(agentId);
  if (!agent) throw new Error('Agent not found');
  
  const commission = amount * AGENCY_COMMISSION_RATE;
  
  return {
    agentId,
    amount: commission,
    type: 'sales_commission'
  };
};

export const calculateReferralReward = async (agentId, transactionAmount) => {
  const agent = await ModelAgent.findByPk(agentId);
  if (!agent) throw new Error('Agent not found');
  
  const referralChain = await getFullReferralChain(agentId);
  const totalReferrers = referralChain.length;
  
  if (totalReferrers === 0) return [];
  
  const totalReferralPool = transactionAmount * REFERRAL_COMMISSION_RATE;
  const individualShare = totalReferralPool / totalReferrers;
  
  return referralChain.map(referrer => ({
    aid: referrer.aid,
    amount: individualShare,
    type: 'referral_commission'
  }));
};
