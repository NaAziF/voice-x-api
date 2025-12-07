import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from 'src/aws/s3/s3.service';

@Injectable()
export class WorkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async getWorkforLanguage(language: string) {
    return await this.prisma.work_pdfs.findMany({
      where: { language: language, is_active: true },
    });
  }

  async getAllWork(userId: number) {
    return await this.prisma.user_recordings.findUnique({
      where: { id: userId },
      include: { work_pdfs: true },
    });
  }

  async addWorkToUser(
    userId: number,
    workId: number,
    recording: Express.Multer.File[],
  ) {
    const data = await this.s3Service.upload(recording);
    if (data.length === 0) {
      throw new Error('No file uploaded');
    }
    const work = await this.prisma.user_recordings.create({
      data: {
        user_id: userId,
        pdf_id: workId,
        recording_url: data[0].doc_path,
      },
    });
    return work;
  }
}
