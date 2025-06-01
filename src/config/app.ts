export const appConfig = {
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT || '3000', 10),
  url: process.env.APP_URL || 'http://localhost:3000',
  isProd: process.env.NODE_ENV === 'production',
  prefixPath: process.env.APP_PREFIX_PATH || '/api',
  documentationPath: process.env.APP_DOCUMENTATION_PATH || '/documentation',
  authCallbackUrl: process.env.APP_AUTH_CALLBACK_URL || '/auth-callback',
  walletCallbackUrl: process.env.APP_WALLET_CALLBACK_URL || '/wallet-callback',
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
  storageType: 's3',
  basicAuth: {
    enabled: process.env.APP_BASIC_AUTH_ENABLED === 'true',
    user: process.env.APP_BASIC_AUTH_USER || '',
    password: process.env.APP_BASIC_AUTH_PASSWORD || '',
  },
  appName: process.env.APP_NAME || '',
  version: process.env.APP_VERSION || '0.0',
};
