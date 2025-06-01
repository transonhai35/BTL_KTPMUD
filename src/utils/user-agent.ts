import { facebooBotUserAgentRegex } from './regex';

export function isFacebootBotUserAgent (userAgent: string): boolean {
  return facebooBotUserAgentRegex.test(userAgent);
}