import { isURL } from 'class-validator';
import { s3Config } from '@/config';

export const isValidUrl = (url: string): boolean => isURL(url, {require_tld: false});

export const cdnBaseUrl = `${s3Config.publicUrl}`;

export function getFileUrl(key: string): string {
  if (!key) return '';
  if (isURL(key)) {
    if (s3Config.publicUrlDepreciated) {
      return key.replace(`${s3Config.publicUrlDepreciated}/`, cdnBaseUrl + '/');
    }
    return key;
  }
  return `${cdnBaseUrl}/${key}`;
}

export function buildAuthCallbackUrl(
  authCallbackUrl: string,
  params: Record<string, string>,
) {
  const qs = new URLSearchParams(params);
  if (authCallbackUrl.indexOf('?') > 0) {
    authCallbackUrl += '&';
  } else {
    authCallbackUrl += '?';
  }
  return authCallbackUrl + qs.toString();
}