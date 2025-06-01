import { PlaidCountryCodeEnum } from '@/common';
import { PlaidProductEnum } from '@/common/enums/plaid/plaid-item';
import { WebhookPlaidCode } from '@/common/enums/plaid/plaid-webhook';

export const availableProducts = [
  PlaidProductEnum.AUTH,
  PlaidProductEnum.ASSETS,
  PlaidProductEnum.TRANSACTIONS,
];

export const availableCountryCodes = [PlaidCountryCodeEnum.US];

export const isRevokeTokenWebhook = (
  webhook_code: WebhookPlaidCode,
): boolean => {
  return [
    WebhookPlaidCode.ITEM_REMOVE,
    WebhookPlaidCode.USER_PERMISSION_REVOKED,
    WebhookPlaidCode.USER_ACCOUNT_REVOKED,
  ].includes(webhook_code);
};

export const isUpdateDataWebhook = (
  webhook_code: WebhookPlaidCode,
): boolean => {
  return [
    WebhookPlaidCode.DEFAULT_UPDATE,
    WebhookPlaidCode.HISTORICAL_UPDATE,
    WebhookPlaidCode.TRANSACTIONS_REMOVED,
  ].includes(webhook_code);
};
