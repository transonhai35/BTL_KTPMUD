import { ChainIdEnum } from '../common/enums/chain-id.enum';
import { Currency } from '../common/enums/crypto-currency';
import { CryptoPlatformEnum } from '../common/enums/crypto_platform.enum';
import { RPC_URL } from './rpcUrl';

export const BLOCKCHAIN_CONFIG = {
  ethereum: {
    name: 'Ethereum',
    rpcUrl: RPC_URL.ethereum,
    chainId: ChainIdEnum.EthereumMainnet,
    currency: Currency.Ethereum,
    platform: CryptoPlatformEnum.Ethereum,
    avatar:'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  },
  bsc: {
    name: 'Binance Smart Chain',
    rpcUrl: RPC_URL.binanceSmartChain,
    chainId: ChainIdEnum.BinanceSmartChainMainnet,
    currency: Currency.BinanceSmartChain,
    avatar:'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
    platform:CryptoPlatformEnum.BinanceSmartChain,
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: RPC_URL.polygon,
    chainId: ChainIdEnum.PolygonMainnet,
    currency: Currency.Polygon,
    platform:CryptoPlatformEnum.Polygon,
    avatar:'https://coin-images.coingecko.com/coins/images/4713/large/polygon.png?1698233745',
  },
  solana: {
    name: 'Solana',
    rpcUrl: RPC_URL.solana,
    chainId: ChainIdEnum.SolanaMainnet,
    currency: Currency.Solana,
    avatar:'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
    platform:CryptoPlatformEnum.Solana,
  },
  bitcoin: {
    name: 'Bitcoin',
    rpcUrl: RPC_URL.bitcoin,
    chainId: ChainIdEnum.BitcoinMainnet,
    platform: CryptoPlatformEnum.Bitcoin,
    avatar:'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?169650140',
    currency: Currency.Bitcoin,
  },
};
