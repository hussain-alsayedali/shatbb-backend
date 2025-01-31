import { Global, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Global()
@Injectable()
export class FileProcessorService {
  async processImage(file: Express.Multer.File) {
    try {
      return await sharp(file.buffer)
        .resize(800)
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toBuffer();
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async processDocument(file: Express.Multer.File) {
    if (file.mimetype.startsWith('image/')) {
      return this.processImage(file);
    }
    // For PDFs, just return original buffer
    return file.buffer;
  }
}
