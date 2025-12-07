import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [WorkController],
  providers: [WorkService],
  exports: [],
})
export class WorkModule {}
