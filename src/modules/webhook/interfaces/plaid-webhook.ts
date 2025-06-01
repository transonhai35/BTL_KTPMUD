import {
  WebhookPlaidCode,
  WebhookPlaidType,
} from '@/common/enums/plaid/plaid-webhook';

export interface PlaidWebhookBody {
  webhook_type: WebhookPlaidType;
  webhook_code: WebhookPlaidCode;
  item_id: string;
  account_id?: string;
}
