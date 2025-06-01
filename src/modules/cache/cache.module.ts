import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ICacheOptions } from './ICache';
import { CACHE_MODULE_OPTIONS } from './constants';
import { ConfigurableModuleClass } from './cache.module-definition';

@Global()
@Module({})
export class CacheModule extends ConfigurableModuleClass {

  static register(options?: ICacheOptions): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        NestCacheModule.register(options)
      ],
      providers: [
        CacheService,
        {
          provide: CACHE_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [CacheService]
    };
  }

}
