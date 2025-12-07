import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { S3Service } from './s3.service';

@Module({
  imports: [PrismaModule],
  providers: [S3Service],
  controllers: [],
  exports: [S3Service],
})
export class S3Module {}
