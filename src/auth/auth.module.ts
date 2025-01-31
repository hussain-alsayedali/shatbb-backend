import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthOrganizationService } from './organization/auth-organization.service';
import { AuthOrganizationController } from './organization/auth-organization.controller';
import { FirebaseAuthStrategy } from './strategies/firebase.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-auth' }),
    HttpModule,
  ],
  providers: [FirebaseAuthStrategy, AuthOrganizationService],
  controllers: [AuthOrganizationController],
})
export class AuthModule {}
