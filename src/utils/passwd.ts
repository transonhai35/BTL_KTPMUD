import { generateSHA } from './crypto';
import { bcryptHashRegex, sha256Regex } from './regex';
import bcrypt from 'bcryptjs';

export const checkHashPassword = (passwd: string, hash: string): boolean  => {
  if (sha256Regex.test(hash)) {
    return generateSHA(passwd, 'sha256') == hash;
  }
  return bcrypt.compareSync(passwd, hash);
};

export const generateHashPassword = (passwd: string): string => {
  // return bcrypt.hashSync(passwd, 10);
  return generateSHA(passwd, 'sha256');
};

export function isPasswordHashed(text: string) {
  return sha256Regex.test(text) || bcryptHashRegex.test(text);
}
