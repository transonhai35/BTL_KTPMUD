export const instagramConfig = {
  clientId: process.env.INSTAGRAM_CLIENT_ID || '',
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirectUri: process.env.INSTAGRAM_REDIRECT_URI || '',
  graphVersion: process.env.INSTAGRAM_GRAPH_VERSION || 'v20.0',
  verifyToken: process.env.INSTAGRAM_VERYFY_TOKEN || '',
  scopes: process.env.INSTAGRAM_SCOPES || 'instagram_business_basic',
};
