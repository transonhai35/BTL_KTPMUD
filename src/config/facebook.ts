export const facebookConfig = {
  clientId: process.env.FACEBOOK_CLIENT_ID || '',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  redirectUri: process.env.FACEBOOK_REDIRECT_URI || '/api/auth/callback/facebook',
  graphVersion: process.env.FACEBOOK_GRAPH_VERSION || 'v20.0',
  verifyToken: process.env.FACEBOOK_VERYFY_TOKEN || '',
  scopes: process.env.FACEBOOK_SCOPES || 'email,public_profile',
  subscribedFields: 'messages'
};
