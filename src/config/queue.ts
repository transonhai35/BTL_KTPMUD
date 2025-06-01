export interface IQueueConfig {
  topic: string;
  groupId?: string;
}

export const sendMailQueueConfig: IQueueConfig = {
  topic: process.env.QUEUE_SEND_MAIL_TOPIC || 'plaid.send-mail',
  groupId: process.env.QUEUE_SEND_MAIL_GROUP_ID || 'send-mail-group-0',
};

export const plaidWebhookQueueConfig: IQueueConfig = {
  topic: process.env.QUEUE_PLAID_WEBHOOK_TOPIC || 'plaid.plaid-webhook',
  groupId: process.env.QUEUE_PLAID_WEBHOOK_GROUP_ID || 'plaid-webhook-group-0',
};
