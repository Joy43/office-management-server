import {
  GetUser,
  ValidateClientAdmin,
  ValidateInternalUser,
} from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardTemplateService } from './dashboard-template.service';
import { GetOwnTemplatesDto } from './dto/GetOwnTemplatesDto';
import { UpdateTemplateStatusDto } from './dto/TemplateStatus.dto';

@ApiTags('Client Admin----------------------Dashboard Templates')
@Controller('dashboard-template')
export class DashboardTemplateController {
  constructor(
    private readonly dashboardTemplateService: DashboardTemplateService,
  ) {}

  // ----------- client admin their active subscription plan dashboard templates get all -----------
  @ApiOperation({
    summary:
      ' active-plan-organization || Get all dashboard templates for the active subscription plan',
  })
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @Get('active-plan-organization')
  async TenentActivePlan(@GetUser('sub') userId: string) {
    return this.dashboardTemplateService.TenentActivePlan(userId);
  }

  // ----------------------- client admin existing template get & select it for using  --------
  @ApiOperation({
    summary:
      'Client admin select a template by ID for their tenant || client admin existing template get & select it for using ',
  })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Post('select-template/:templateId')
  selectTemplate(
    @Req() req: any,
    @Param('templateId') templateId: string,
    @GetUser('sub') userId: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.dashboardTemplateService.selectTemplateById(
      templateId,
      tenantId,
      userId,
    );
  }

  // ----------------- client admin their own created templates get all ----------------------

  @ApiOperation({ summary: 'Get all templates created by the client admin || All templates superadmin dashboard already here, use superadmin api' })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Get('own-templates')
  getOwnTemplates(@Req() req: any, @Query() query: GetOwnTemplatesDto) {
    const tenantId = req.user.tenantId;
    return this.dashboardTemplateService.getOwnTemplates(tenantId, query);
  }

  @ApiOperation({ summary: 'Update template status' })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Patch('update-status/:templateId')
  updateTemplateStatus(
    @Param('templateId') templateId: string,
    @Body() dto: UpdateTemplateStatusDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;

    return this.dashboardTemplateService.updateTemplateStatus(
      templateId,
      dto.templatestatus,
      tenantId,
    );
  }

  // ------------------------- delete by own template ----------------------
  @ApiOperation({ summary: 'Delete a template by ID' })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Delete('delete-template/:templateId')
  deleteTemplate(@Param('templateId') templateId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.dashboardTemplateService.deleteTemplate(templateId, tenantId);
  }
}
