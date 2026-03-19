import { Module } from '@nestjs/common';
import { GlobalTemplateService } from './global-template.service';
import { GlobalTemplateController } from './global-template.controller';

@Module({
  controllers: [GlobalTemplateController],
  providers: [GlobalTemplateService],
})
export class GlobalTemplateModule {}
