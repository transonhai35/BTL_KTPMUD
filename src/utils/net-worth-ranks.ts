import { NetWorthRankEnum } from '../common/enums/net-worth-ranks.enum';

export const NET_WORTH_RANKS = [
  { range: 0, tierName: NetWorthRankEnum.AMBER },
  { range: 251, tierName: NetWorthRankEnum.RUBY },
  { range: 1001, tierName: NetWorthRankEnum.TOPAZ },
  { range: 2501, tierName: NetWorthRankEnum.EMERALD },
  { range: 10001, tierName: NetWorthRankEnum.DIAMOND },
  { range: 100001, tierName: NetWorthRankEnum.ONYX },
  { range: 500001, tierName: NetWorthRankEnum.ROYAL },
  { range: 1000001, tierName: NetWorthRankEnum.CROWN },
];

export function getRankByNetWorth(netWorth: number) {
  return NET_WORTH_RANKS.reduce((prev, curr) => (netWorth >= curr.range ? curr : prev), NET_WORTH_RANKS[0]);
}

export function isHigherRank(newRank: NetWorthRankEnum, oldRank: NetWorthRankEnum): boolean {
  const level = NET_WORTH_RANKS.map(r => r.tierName);
  return level.indexOf(newRank) > level.indexOf(oldRank);
}