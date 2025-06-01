export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || '/api/auth/callback/google',
  scopes: process.env.GOOGLE_SCOPES || 'email profile openid',
};