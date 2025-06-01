import { NetWorthRankEnum } from '../common';

export interface IRankAttributes {
  id: NetWorthRankEnum;
  displayName: string;
  minNetWorth: number;
  color: string;
  icon?: string;
  logo?: string;
  description?: string;
}

export const NetWorthRankConfig: Record<NetWorthRankEnum, IRankAttributes> = {
  [NetWorthRankEnum.AMBER]: {
    id: NetWorthRankEnum.AMBER,
    displayName: 'Amber Rank',
    minNetWorth: 0,
    color: '#FFBF00',
    icon: '🔸',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187833108-Group%2048096445.svg",
    description: "Basic Access, Scholarships, Peer Events",
  },
  [NetWorthRankEnum.RUBY]: {
    id: NetWorthRankEnum.RUBY,
    displayName: 'Ruby Rank',
    minNetWorth: 25001,
    color: '#E0115F',
    icon: '🔴',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187797424-Group%2048096442.svg",
    description: "Access to Rental / Vehical Pools",
  },
  [NetWorthRankEnum.TOPAZ]: {
    id: NetWorthRankEnum.TOPAZ,
    displayName: 'Topaz Rank',
    minNetWorth: 100001,
    color: '#FFC87C',
    icon: '🔵',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187817037-Group%2048096444.svg",
    description: "Priority Job & Loan Matchmaking",
  },
  [NetWorthRankEnum.EMERALD]: {
    id: NetWorthRankEnum.EMERALD,
    displayName: 'Emerald Rank',
    minNetWorth: 250001,
    color: '#50C878',
    icon: '🟢',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187848755-Group%2048096446.svg",
    description: "Financial Advisor Matching, Private Offers",
  },
  [NetWorthRankEnum.DIAMOND]: {
    id: NetWorthRankEnum.DIAMOND,
    displayName: 'Diamond Rank',
    minNetWorth: 1000001,
    color: '#B9F2FF',
    icon: '💎',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187365703-Group%2048096441.svg",
    description: "Exclusive Deals, Luxury Events",
  },
  [NetWorthRankEnum.ONYX]: {
    id: NetWorthRankEnum.ONYX,
    displayName: 'Onyx Rank',
    minNetWorth: 10000001,
    color: '#353839',
    icon: '🌑',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187339891-Group%2048096433.svg",
    description: "Access to High-End Investment Deals",
  },
  [NetWorthRankEnum.ROYAL]: {
    id: NetWorthRankEnum.ROYAL,
    displayName: 'Royal Rank',
    minNetWorth: 50000001,
    color: '#800080',
    icon: '👑',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187181767-Group%2048096432.svg",
    description: "Ultra-VIP Programs, Private Equity Access",
  },
  [NetWorthRankEnum.CROWN]: {
    id: NetWorthRankEnum.CROWN,
    displayName: 'Crown Rank',
    minNetWorth: 100000001,
    color: '#FFD700',
    icon: '👑',
    logo: "https://s3-sgp2.bamboosoft.io/fansee/2025/04/09/1744187863500-Group%2048096447.svg",
    description: "Custom Conceierge Access, Global Services",
  }
};