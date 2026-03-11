import { successResponse } from '@/common/response/response.util';
import { GetUser, ValidateInternalUser } from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGlobalTemplateDto } from './dto/create-global-template.dto';
import { TemplateFilterDto } from './dto/templateFilter.dto';
import { UpdateGlobalTemplateDto } from './dto/update-global-template.dto';
import { GlobalTemplateService } from './global-template.service';

@ApiTags('Super Admin-------------global template')
@Controller('global-template')
export class GlobalTemplateController {
  constructor(private readonly globalTemplateService: GlobalTemplateService) {}
  @ApiOperation({
    summary: 'Create global template.This operation can perform admin',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Post('create-template')
  async createGlobalTemplate(
    @Body() createGlobalTemplateDto: CreateGlobalTemplateDto,
    @GetUser('sub') createdBy: string,
  ) {
    return this.globalTemplateService.createGlobalTemplate(
      createGlobalTemplateDto,
      createdBy,
    );
  }

  @ApiOperation({
    summary:
      'Get all global templates with filter and pagination || user can get their own templates || internal user access it',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Get('template')
  async findAllTemplate(@Query() filter: TemplateFilterDto) {
    const res = await this.globalTemplateService.findAllTemplate(filter);
    return successResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Templates found successfully',
      data: res,
    });
  }

  @ApiBearerAuth()
  @ValidateInternalUser()
  @Get(':id')
  async findOneTemplate(@Param('id') id: string) {
    const Isexit = await this.globalTemplateService.findOneTemplate(id);
    return successResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Template found successfully',
      data: Isexit,
    });
  }
  // ----------------------- Admin can perform this operation------
  @ApiOperation({
    summary: 'Update global template.This operation can perform admin',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Patch('update-template/:id')
  // ------------------ update global template----------------
  async updateGlobalTemplate(
    @Param('id') id: string,
    @Body() updateGlobalTemplateDto: UpdateGlobalTemplateDto,
  ) {
    const res = await this.globalTemplateService.updateGlobalTemplate(
      id,
      updateGlobalTemplateDto,
    );
    return successResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Template updated successfully',
      data: res,
    });
  }

  // ----------------------- Admin can perform this operation---------------------
  @ApiOperation({
    summary:
      'Delete global template.This operation can perform admin like soft delete',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Delete('delete-template/:id')
  async removeTemplate(@Param('id') id: string) {
    const res = await this.globalTemplateService.removeTemplate(id);
    return successResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Template deleted successfully',
      data: null,
    });
  }

  // ----------------------- Admin can perform this operation------
  @ApiOperation({
    summary:
      'Toggle global template active status || like isActive on or off toggle.This operation can perform',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Patch('toggle-status/:id')
  async toggleStatusOfTemplate(@Param('id') id: string) {
    const res = await this.globalTemplateService.toggleStatus(id);

    return successResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Template status changed successfully',
      data: res,
    });
  }
}
