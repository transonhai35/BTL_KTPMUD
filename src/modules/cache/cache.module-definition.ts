import { ConfigurableModuleBuilder } from '@nestjs/common';
import {
  ICacheOptions
} from './ICache';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ICacheOptions>({
    moduleName: 'Cache',
  })
    .build();