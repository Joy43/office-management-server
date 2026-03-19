import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Prisma } from '@prisma';
import { CreateGlobalTemplateDto } from './dto/create-global-template.dto';
import { TemplateFilterDto } from './dto/templateFilter.dto';
import { UpdateGlobalTemplateDto } from './dto/update-global-template.dto';

@Injectable()
export class GlobalTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create template')
  async createGlobalTemplate(
    createGlobalTemplateDto: CreateGlobalTemplateDto,
    createdBy: string,
  ) {
    const { templateName } = createGlobalTemplateDto;

    const existingTemplate = await this.prisma.client.template.findFirst({
      where: {
        templateName,
        isGlobal: true,
      },
    });

    if (existingTemplate) {
      throw new BadRequestException({
        message: 'Template name already exists',
        field: 'templateName',
      });
    }

    return this.prisma.client.template.create({
      data: {
        templateName: createGlobalTemplateDto.templateName,
        type: createGlobalTemplateDto.type ?? '',
        timeLimit: createGlobalTemplateDto.timeLimit ?? '15',
        content: createGlobalTemplateDto.content ?? {},
        isGlobal: createGlobalTemplateDto.isGlobal ?? true,
        createdBy,
      },
    });
  }

  // ---------------- GET ALL TEMPLATES ------------------
  @HandleError('Failed to fetch templates')
  async findAllTemplate(filter: TemplateFilterDto) {
    const { search, page = 1, limit = 10, isActive } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.TemplateWhereInput = {};

    if (search) {
      where.OR = [
        { templateName: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.client.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.template.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ------------------ GET TEMPLATE BY ID ------------------
  @HandleError('Failed to fetch template')
  async findOneTemplate(id: string) {
    const template = await this.prisma.client.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }
  // ------------------ UPDATE TEMPLATE ------------------
  @HandleError('Failed to update template')
  async updateGlobalTemplate(
    id: string,
    updateGlobalTemplateDto: UpdateGlobalTemplateDto,
  ) {
    try {
      return await this.prisma.client.template.update({
        where: { id },
        data: updateGlobalTemplateDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Template with ID ${id} not found`);
      }
      throw error;
    }
  }

  // ------------------ DELETE TEMPLATE ------------------
  @HandleError('Failed to delete template')
  async removeTemplate(id: string) {
    try {
      return await this.prisma.client.template.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Template with ID ${id} not found`);
      }
      throw error;
    }
  }
  // ------------------ TOGGLE TEMPLATE STATUS ------------------
  // ------------------ TOGGLE TEMPLATE STATUS ------------------
  @HandleError('Failed to toggle template status')
  async toggleStatus(id: string) {
    const existingTemplate = await this.prisma.client.template.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }

    const newStatus = !(existingTemplate.isActive ?? true);

    return this.prisma.client.template.update({
      where: { id },
      data: { isActive: newStatus },
      select: {
        id: true,
        templateName: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }
}
