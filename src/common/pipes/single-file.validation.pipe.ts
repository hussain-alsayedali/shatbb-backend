import { PipeTransform, Injectable } from '@nestjs/common';
import { FileValidationBase } from './file-validation.base';

@Injectable()
export class SingleFileValidationPipe
  extends FileValidationBase
  implements PipeTransform
{
  constructor(
    private readonly allowedTypes: string[],
    private readonly maxSizeMB: number,
  ) {
    super();
  }

  transform(file: Express.Multer.File) {
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    this.validateFile(file, this.allowedTypes, maxSizeBytes);
    return file;
  }
}
