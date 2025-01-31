import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FileValidationBase } from './file-validation.base';

@Injectable()
export class UniversalFileValidationPipe
  extends FileValidationBase
  implements PipeTransform
{
  constructor(
    private readonly allowedTypes: string[],
    private readonly maxSizeMB: number,
    private readonly isMultiple: boolean = false,
  ) {
    super();
  }

  transform(value: Express.Multer.File | Express.Multer.File[]) {
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;

    if (this.isMultiple) {
      const files = Array.isArray(value) ? value : [value];
      this.validateFiles(files, this.allowedTypes, maxSizeBytes);
      return files;
    }

    if (Array.isArray(value)) {
      throw new BadRequestException('Single file expected');
    }

    this.validateFile(value, this.allowedTypes, maxSizeBytes);
    return value;
  }
}
