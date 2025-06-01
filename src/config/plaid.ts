import { appConfig } from './app';

export const plaidConfig = {
  plaidEndpoint: appConfig.isProd
    ? process.env.PLAID_ENDPOINT_PRODUCTION
    : process.env.PLAID_ENDPOINT_SAND_BOX,
  plaidClientId: process.env.PLAID_CLIENT_ID || '',
  plaidSecret: process.env.PLAID_SECRET || '',
  plaidWebhookUrl:
    appConfig.url +
    appConfig.prefixPath +
    (process.env.PLAID_WEBHOOK_URL || ''),
};
