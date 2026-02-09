import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Controller('work')
export class WorkController {
  constructor(
    private readonly workService: WorkService,
    private readonly mailerService: MailerService,
  ) {}
  @Get('language/:language')
  async getWorkforLanguage(@Param('language') language: string) {
    return await this.workService.getWorkforLanguage(language);
  }

  @Get('user/:userId')
  async getAllWork(@Param('userId', ParseIntPipe) userId: number) {
    return await this.workService.getAllWork(userId);
  }

  @Post('work/upload')
  @UseInterceptors(AnyFilesInterceptor())
  async addWorkToUser(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return await this.workService.addWorkToUser(files);
  }
  /////////////////////

  @Post('upload')
  @UseInterceptors(FileInterceptor('audio')) // Matches the key in your FormData
  async uploadRecording(
    @UploadedFile() file: Express.Multer.File,
    @Body('language') language: string,
    @Body('duration') duration: string,
    @Body('timestamp') timestamp: string,
  ) {
    try {
      // 1. Log the incoming data (for debugging)
      console.log('File received:', file.originalname);
      console.log('Metadata:', { language, duration, timestamp });

      // 2. Send the Email
      await this.mailerService.sendMail({
        to: 'faizan.dar@imperialplatforms.com', // Change this
        subject: 'New Audio Recording Uploaded',
        template: './recording', // optional: path to a template
        context: { language, duration, timestamp },
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer, // The file is stored in memory buffer
            contentType: file.mimetype,
          },
        ],
        html: `
          <h3>New Recording Received</h3>
          <p><b>Language:</b> ${language}</p>
          <p><b>Duration:</b> ${duration} seconds</p>
          <p><b>Timestamp:</b> ${timestamp}</p>
        `,
      });

      return {
        success: true,
        message: 'Recording uploaded and email sent!',
        recordingId: Date.now().toString(), // Mock ID
      };
    } catch (error) {
      console.error('Mail Error:', error);
      return {
        success: false,
        message: 'File received but email failed to send.',
      };
    }
  }
}
