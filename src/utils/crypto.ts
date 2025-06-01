import crypto from 'crypto';

export function generateSHA(text: string, alg = 'sha1'): string {
  return crypto.createHash(alg).update(text).digest('hex');
}