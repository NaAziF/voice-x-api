import { Module } from '@nestjs/common';
import { S3Module } from './aws/s3/s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { WorkModule } from './modules/work/work.module';
import { UserModule } from './modules/users/user.module';
import { MailerModule } from '@nestjs-modules/mailer/dist';

@Module({
  imports: [
    S3Module,
    WorkModule,
    MailerModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow('SMTP_HOST'),
          port: config.getOrThrow<number>('SMTP_PORT'),
          auth: {
            user: config.getOrThrow('SMTP_AUTH_USER'),
            pass: config.getOrThrow('SMTP_AUTH_PASS'),
          },
        },
      }),
    }),
    //Controller Less
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
