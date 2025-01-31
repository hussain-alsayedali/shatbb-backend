import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserData } from 'src/auth/decorator/get-user.decorator';

@ApiBearerAuth()
@Controller('organizaition')
export class OrganizaitionController {
  @Get()
  getCurrentOrganizaition(@UserData() user: any) {
    return user;
  }
}
