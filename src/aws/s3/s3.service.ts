import { ConflictException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';

import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { UploadedToS3Dto } from './dto';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  private readonly bucketName =
    this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
  private readonly s3Client = new S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  // async getSignedUploadUrl(key: string) {
  //   const command = new PutObjectCommand({
  //     Bucket: this.bucketName,
  //     Key: key,
  //   });
  //   const url = await getSignedUrl(this.s3Client, command, {
  //     expiresIn: 15 * 60,
  //   });
  //   // console.log(url);
  //   return url;
  // }

  async upload(files: Array<Express.Multer.File>): Promise<UploadedToS3Dto[]> {
    const uploadedObj: Array<UploadedToS3Dto> = [];
    if (!files) {
      return [];
    }
    try {
      await Promise.all(
        files?.map(async (file) => {
          const params = {
            Bucket: this.bucketName,
            Key: `uploaded/${file.fieldname}/${randomUUID()}`,
            ContentType: file.mimetype,
            Body: file.buffer,
            ContentLength: file.size,
          };
          await this.s3Client.send(new PutObjectCommand(params));

          uploadedObj.push({
            doc_path: params.Key,
            doc_name: file.fieldname,
          });
        }),
      );
    } catch (error) {
      throw new ConflictException(error);
    }

    return uploadedObj;
  }

  async updateOne(file: Express.Multer.File[], key?: string): Promise<object> {
    if (!file) return [{ conflict: 'No file uploaded' }];
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: file[0].mimetype,
      Body: file[0].buffer,
    };
    return await this.s3Client.send(new PutObjectCommand(params));
  }

  async getS3Files(): Promise<object> {
    const s3Data = await this.s3Client.send(
      new GetObjectCommand({ Key: '', Bucket: '' }),
    );

    return s3Data;
  }

  async deleteFileFromS3(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Key: key, Bucket: this.bucketName }),
      );
      return;
    } catch (error) {
      throw new ConflictException('Deletion failed', error);
    }
  }
}
