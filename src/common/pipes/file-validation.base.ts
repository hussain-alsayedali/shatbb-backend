import { BadRequestException } from '@nestjs/common';

export abstract class FileValidationBase {
  protected validateFile(
    file: Express.Multer.File,
    allowedTypes: string[],
    maxSize: number,
  ) {
    if (!file) throw new BadRequestException('File is required');

    // Validate file type
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / 1024 / 1024;
      throw new BadRequestException(
        `File ${file.originalname} exceeds ${maxSizeMB}MB limit`,
      );
    }
  }

  protected validateFiles(
    files: Express.Multer.File[],
    allowedTypes: string[],
    maxSize: number,
  ) {
    if (!files?.length) throw new BadRequestException('Files are required');

    files.forEach((file) => this.validateFile(file, allowedTypes, maxSize));
  }
}
