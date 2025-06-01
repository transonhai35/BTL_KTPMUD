const kafkaSaslEnabled = process.env.KAFKA_SASL_ENABLED == 'true';

export const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['127.0.0.1:9094'],
  clientId: process.env.KAFKA_CLIENT_ID || 'bbigc-be',
  groupId: process.env.KAFKA_GROUP_ID || 'bbigc-be',
  kafkaSaslEnabled,
  sasl: kafkaSaslEnabled? {
    mechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
    username: process.env.KAFKA_SASL_USERNAME || '',
    password: process.env.KAFKA_SASL_PASSWORD || ''
  }: undefined
};
