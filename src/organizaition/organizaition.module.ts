import { Module } from '@nestjs/common';
import { OrganizaitionController } from './organizaition.controller';
import { OrganizaitionService } from './organizaition.service';

@Module({
  controllers: [OrganizaitionController],
  providers: [OrganizaitionService]
})
export class OrganizaitionModule {}
