export const twitterConfig = {
  clientId: process.env.TWITTER_CLIENT_ID || '',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  codeVerifier: process.env.TWITTER_CODE_VERIFIER || 'challenge',
  redirectUri: process.env.TWITTER_REDIRECT_URI || '/api/auth/callback/twitter',
  scopes: process.env.TWITTER_SCOPES || 'tweet.read users.read follows.read offline.access',
};