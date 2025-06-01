import { AuthService } from './services/auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    PassportModule.register({
      property: 'user',
    }),
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    UploadModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
