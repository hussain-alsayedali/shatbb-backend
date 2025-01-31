import { Body, Controller, Post } from '@nestjs/common';
import { AuthOrganizationService } from './auth-organization.service';
import { OrganizaitionSignupDto } from '../dto/organization-signup.dto';

@Controller('organization-auth')
export class AuthOrganizationController {
  constructor(private organizationAuthService: AuthOrganizationService) {}

  @Post('signup')
  signup(@Body() dto: OrganizaitionSignupDto) {
    return this.organizationAuthService.signup(dto);
  }
}
