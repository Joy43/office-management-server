import { Global, Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { S3FileService } from './services/s3.service';


@Global()
@Module({
  providers: [FileService, S3FileService],
  exports: [FileService, S3FileService],
})
export class FileModule {}