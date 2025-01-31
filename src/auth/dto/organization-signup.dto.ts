import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OrganizaitionSignupDto {
  @ApiProperty({ example: 'الرياض المتحدة' })
  @IsString()
  @IsNotEmpty()
  organizaitionName: string;

  @ApiProperty({ example: 'Riyadh muthidah' })
  @IsString()
  @IsNotEmpty()
  organizaitionNameEnglish: string;

  @ApiProperty({ example: 'Ministry' })
  @IsEnum(['Company', 'Ministry'])
  @IsString()
  @IsNotEmpty()
  organizaitionType: string;

  @ApiProperty({ example: 'Riyadh' })
  @IsString()
  @IsNotEmpty()
  mainLocation: string;

  @ApiProperty({ example: 'ahmed@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+966551663355' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  numberOfEmployees: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  numberOfBranches: number;

  @ApiProperty({
    type: 'string',
    format: 'binary', // Indicates a file upload
    description: 'The driver license file',
  })
  identificationFile: Express.Multer.File; // Use Multer.File
}
