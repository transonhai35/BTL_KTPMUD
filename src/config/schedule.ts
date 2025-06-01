import { CronExpression } from '@nestjs/schedule';

export const scheduleConfig = {
  updateLeaderboardRealtime:
    process.env.SCHEDULE_UPDATE_LEADERBOARD_REAL_TIME || '0 */1 * * *', // Every 1 hour
  updatePointsAfterEthereumTransaction:
    process.env.SCHEDULE_UPDATE_POINTS_AFTER_ETHEREUM_TRANSACTION ||
    CronExpression.EVERY_MINUTE ||
    '*/1 * * * *', // job schedule every 1 minutes to get transactions
  updatePointsAfterSolanaTransaction:
    process.env.SCHEDULE_UPDATE_POINTS_AFTER_SOLANA_TRANSACTION ||
    CronExpression.EVERY_MINUTE ||
    '*/1 * * * *', // job schedule every 1 minutes to get transactions
  updatePointsAfterBscTransaction:
    process.env.SCHEDULE_UPDATE_POINTS_AFTER_BSC_TRANSACTION ||
    CronExpression.EVERY_MINUTE ||
    '*/1 * * * *', // job schedule every 1 minutes to get transactions
  updateCryptoPriceRealtime:
    process.env.SCHEDULE_UPDATE_CRYPTO_PRICE_REAL_TIME || '*/20 * * * *', // Every 20 minutes,
  updateExpiredMarketplaceItems:
    process.env.SCHEDULE_UPDATE_EXPIRED_MARKETPLACE_ITEMS ||
    CronExpression.EVERY_5_MINUTES ||
    '*/5 * * * *', // Every 5 minutes
  handlePendingBlockchainTransactionsWithoutRefId:
    process.env.SCHEDULE_UPDATE_ALL_PENDING_BLOCKCHAIN_TRANSACTION ||
    CronExpression.EVERY_HOUR ||
    '0 */1 * * *', // Every 1 hour
  updateTokenPrice:
    process.env.SCHEDULE_UPDATE_TOKEN_PRICE || '*/20 * * * * *', // job schedule every 20 seconds to get transactions
};
