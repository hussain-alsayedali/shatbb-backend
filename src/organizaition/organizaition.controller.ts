import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserData } from 'src/auth/decorator/get-user.decorator';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';

@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('organizaition')
export class OrganizaitionController {
  @Get()
  getCurrentOrganizaition(@UserData() user: any) {
    console.log('user ', user);
    return user;
  }
}
