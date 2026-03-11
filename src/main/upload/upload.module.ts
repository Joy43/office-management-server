import { Module } from '@nestjs/common';
import { UploadS3Controller } from './upload.controller';
import { UploadS3Service } from './upload.service';

@Module({
  controllers: [UploadS3Controller],
  providers: [UploadS3Service],
})
export class UploadModule {}
