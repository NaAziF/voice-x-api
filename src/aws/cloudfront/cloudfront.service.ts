import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudfrontService {
  constructor(private config: ConfigService) {}

  private readonly baseurl = this.config.getOrThrow('AWS_CDN_BASE_URL');
  getCdnUrl(path: string) {
    return this.baseurl + path;
  }
}
