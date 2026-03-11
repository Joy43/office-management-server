import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateExcutiveDto } from '../dto/create-excutive.dto';
import { UpdateExcutiveDto } from '../dto/update-excutive.dto';
import { ExcutiveService } from '../service/excutive.service';

@ApiTags('Excutive --------------------- Excutive Dashboard')
@Controller('excutive')
export class ExcutiveController {
  constructor(private readonly excutiveService: ExcutiveService) {}

  @Post()
  create(@Body() createExcutiveDto: CreateExcutiveDto) {
    return this.excutiveService.create(createExcutiveDto);
  }

  @Get()
  findAll() {
    return this.excutiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.excutiveService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExcutiveDto: UpdateExcutiveDto,
  ) {
    return this.excutiveService.update(+id, updateExcutiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.excutiveService.remove(+id);
  }
}
