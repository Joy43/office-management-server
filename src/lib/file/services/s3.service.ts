// file.service.ts
import { ENVEnum } from '@/common/enum/env.enum';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as mime from 'mime-types';
import * as path from 'path';

@Injectable()
export class S3FileService {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get(ENVEnum.AWS_ACCESS_KEY_ID);
    const secretAccessKey = this.configService.get(
      ENVEnum.AWS_SECRET_ACCESS_KEY,
    );
    const region = this.configService.get(ENVEnum.AWS_REGION) || 'us-east-1';
    this.bucketName = this.configService.get(
      ENVEnum.AWS_S3_BUCKET_NAME,
    ) as string;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'Missing AWS credentials. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file',
      );
    }

    if (!this.bucketName) {
      throw new Error('Missing AWS_S3_BUCKET_NAME in .env file');
    }

    this.s3 = new S3({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log(
      `✅ S3 initialized with region: ${region}, bucket: ${this.bucketName}`,
    );
  }
  async processUploadedFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    //------- Validate file object------------
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!file.path) {
      throw new BadRequestException(
        'File path is missing; ensure Multer is configured with diskStorage',
      );
    }

    //-----  Validate file type and size ------
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/heic',
      'image/heif',
      'image/avif',

      // Videos
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/mov',
      'video/avi',
      'video/mkv',
      'video/flv',

      // Audio
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
      'audio/m4a',

      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',

      // Compressed
      'application/x-rar-compressed',
      'application/zip',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',

      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
      // xml
      'application/xml',
      'text/xml',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',

      // Other common types
      'application/json',
      'application/xml',
      'text/xml',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
    ];
    const mimeType = file.mimetype;
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(`Invalid file type: ${mimeType}`);
    }
    if (file.size > 9000 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 2GB');
    }

    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeFileName = `${Date.now()}-${baseName.replace(/[^a-zA-Z0-9.-]/g, '_')}${ext}`;
    const contentType = mime.lookup(ext) || 'application/octet-stream';

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: `content/${safeFileName}`,
        Body: await fs.readFile(file.path),
        ContentType: contentType,
      },
    });

    try {
      const result = await upload.done();
      try {
        await fs.unlink(file.path);
        console.log(`Deleted local file: ${file.path}`);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.warn(`Failed to delete local file ${file.path}:`, err);
        }
      }
      return {
        url: result.Location as string,
        key: safeFileName,
      };
    } catch (err) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkErr) {
        if (unlinkErr.code !== 'ENOENT') {
          console.warn(`Failed to delete local file ${file.path}:`, unlinkErr);
        }
      }
      console.error('Failed to upload file to S3:', err);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }
}
