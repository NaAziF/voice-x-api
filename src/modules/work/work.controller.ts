import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}
  @Get('language/:language')
  async getWorkforLanguage(@Param('language') language: string) {
    return await this.workService.getWorkforLanguage(language);
  }

  @Get('user/:userId')
  async getAllWork(@Param('userId', ParseIntPipe) userId: number) {
    return await this.workService.getAllWork(userId);
  }

  @Post('user/:userId/work/:workId')
  @UseInterceptors(AnyFilesInterceptor())
  async addWorkToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('workId', ParseIntPipe) workId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.workService.addWorkToUser(userId, workId, files);
  }
}
