export const bannedUsernames = [
  'admin',
  'administrator',
  'root',
  'superuser',
  'system',
  'test',
  'guest',
  'support',
  'manager',
  'moderator',
  'webmaster',
  'owner',
  'staff',
  'dev',
  'developer',
  'demo',
  'testuser',
  'master',
  'user',
  'login',
  'account',
  'service',
  'help',
  'maintenance',
  'api',
  'default',
  'rootuser',
  'administrator1',
  'admin123',
  '12345',
  'qwerty',
  'password',
  'abc123',
  'welcome',
  'changeme',
];

export function isBannedUsername(username: string): boolean {
  return bannedUsernames.includes(username.toLowerCase());
}

export function buildUsernameFromWalletAddress(addr: string = ''): string | null {
  if (!addr) return null;
  return `wallet_${addr.substring(Math.max(addr.length - 8, 0)).toLowerCase()}`;
}