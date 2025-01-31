import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthOrganizationService } from './auth-organization.service';
import { OrganizaitionSignupDto } from '../dto/organization-signup.dto';
import { DocumentPipe } from 'src/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('DRIVERS')
@Controller('organization-auth')
export class AuthOrganizationController {
  constructor(private organizationAuthService: AuthOrganizationService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('identificationFile'))
  @ApiConsumes('multipart/form-data') // Specify the content type
  signup(
    @Body() dto: OrganizaitionSignupDto,
    @UploadedFile(DocumentPipe) file: Express.Multer.File,
  ) {
    dto.identificationFile = file;
    return this.organizationAuthService.signup(dto);
  }
}
