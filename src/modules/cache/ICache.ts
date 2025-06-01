export interface ICache {
  set(key: string, value: any, ttl?: number): Promise<void>;
  get<T>(key: string): Promise<T>;
  del(key: string): Promise<void>;
  reset(): Promise<void>;
}

export interface ICacheOptions {
  ttl?: number;
  max?: number;
  prefix?: string;
  isGlobal?: boolean;
}