import { IsString } from 'class-validator';

export class UploadedToS3Dto {
  @IsString()
  doc_name: string;

  doc_path: string;
}
