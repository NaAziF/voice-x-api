import { Module } from '@nestjs/common';
import { S3Module } from './aws/s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { WorkModule } from './modules/work/work.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    S3Module,
    WorkModule,
    UserModule,
    //Controller Less
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
