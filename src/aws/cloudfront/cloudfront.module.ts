import { Module } from '@nestjs/common';
import { CloudfrontService } from './cloudfront.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  providers: [CloudfrontService],
  imports: [PrismaModule],
  exports: [CloudfrontService],
})
export class CloudfrontModule {}
