import { ICache, ICacheOptions } from './ICache';
import { CACHE_MODULE_OPTIONS } from './constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService implements ICache {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, 
    @Inject(CACHE_MODULE_OPTIONS) private cacheOptions: ICacheOptions
  ) {}
  
  set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cacheManager.set(key, value, ttl);
  }
  get<T>(key: string): Promise<T> {
    return this.cacheManager.get(key);
  }
  del(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }
  reset(): Promise<void> {
    return this.cacheManager.reset();
  }
}
