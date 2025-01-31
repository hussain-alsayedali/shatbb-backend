import { MultiFileValidationPipe } from './multi-file.validation.pipe';
import { SingleFileValidationPipe } from './single-file.validation.pipe';
import { UniversalFileValidationPipe } from './universal-file.validation.pipe';

// For single image files (JPEG/PNG)
export const SinglePhotoPipe = new UniversalFileValidationPipe(
  ['image/jpeg', 'image/png'],
  3,
  false,
);

// For multiple image files
export const MultiplePhotosPipe = new UniversalFileValidationPipe(
  ['image/jpeg', 'image/png'],
  3,
  true,
);

// For single PDF or image
export const DocumentPipe = new UniversalFileValidationPipe(
  ['image/jpeg', 'image/png', 'application/pdf'],
  3,
  false,
);

// For multiple PDFs or images
export const DocumentsPipe = new UniversalFileValidationPipe(
  ['image/jpeg', 'image/png', 'application/pdf'],
  3,
  true,
);
