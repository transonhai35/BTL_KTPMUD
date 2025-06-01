import { BLOCKCHAIN_CONFIG } from '../config/blockChain';

export function getChainById(chainId: string | number) {
  return Object.values(BLOCKCHAIN_CONFIG).find(
    (val) => val.chainId === String(chainId)
  );
}