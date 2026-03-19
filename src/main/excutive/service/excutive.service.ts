import { Injectable } from '@nestjs/common';
import { CreateExcutiveDto } from '../dto/create-excutive.dto';
import { UpdateExcutiveDto } from '../dto/update-excutive.dto';

@Injectable()
export class ExcutiveService {
  create(createExcutiveDto: CreateExcutiveDto) {
    return 'This action adds a new excutive';
  }

  findAll() {
    return `This action returns all excutive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} excutive`;
  }

  update(id: number, updateExcutiveDto: UpdateExcutiveDto) {
    return `This action updates a #${id} excutive`;
  }

  remove(id: number) {
    return `This action removes a #${id} excutive`;
  }
}
