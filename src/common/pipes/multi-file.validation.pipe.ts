import { PipeTransform, Injectable } from '@nestjs/common';
import { FileValidationBase } from './file-validation.base';

@Injectable()
export class MultiFileValidationPipe
  extends FileValidationBase
  implements PipeTransform
{
  constructor(
    private readonly allowedTypes: string[],
    private readonly maxSizeMB: number,
  ) {
    super();
  }

  transform(files: Express.Multer.File[]) {
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    this.validateFiles(files, this.allowedTypes, maxSizeBytes);
    return files;
  }
}
