import { Module } from '@nestjs/common';
import { ExcutiveController } from './controller/excutive.controller';
import { ExcutiveService } from './service/excutive.service';

@Module({
  controllers: [ExcutiveController],
  providers: [ExcutiveService],
})
export class ExcutiveModule {}
