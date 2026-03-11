import { successResponse } from '@/common/response/response.util';
import { ValidateAdmin } from '@/core/jwt/jwt.decorator';
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
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantFilterDto } from './dto/findTenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantManageService } from './service/tenant.manage.service';
import { TenantService } from './service/tenant.service';

@ApiTags('Super Admin----------------Tenant Management')
@Controller('tenant')
@ApiBearerAuth()
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantMange: TenantManageService,
  ) {}

  @Post('create-tenant')
  @ValidateAdmin()
  @ApiOperation({
    summary:
      'Create a new tenant.Just super admin can do this || varified it first then it use it',
  })
  async createTenat(@Body() createTenantDto: CreateTenantDto) {
    const res = await this.tenantService.createTenant(createTenantDto);
    return successResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Tenant created successfully',
      data: res,
    });
  }
  // ----------------------- Admin can perform this operation------
  @Patch('update/:id')
  @ValidateAdmin()
  @ApiOperation({
    summary: 'Update tenant details.Just admin can perform this operation',
  })
  async updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    const res = await this.tenantMange.updateTenant(id, updateTenantDto);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Tenant updated successfully',
      data: res,
    });
  }
  // ----------------------- Admin can perform this operation------
  @Get()
  @ValidateAdmin()
  @ApiOperation({ summary: 'Get all tenant' })
  async findAllTenant(@Query() filter: TenantFilterDto) {
    const res = await this.tenantMange.findAll(filter);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Tenant fetched successfully',
      data: res,
    });
  }

  // ----------------------- Admin can perform this operation------
  @Get(':id')
  @ValidateAdmin()
  @ApiOperation({ summary: 'Get single tenant by id' })
  async findOneTenant(@Param('id') id: string) {
    const res = await this.tenantMange.findSingleTenant(id);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Tenant fetched successfully',
      data: res,
    });
  }

  @Delete('delete:id')
  @ValidateAdmin()
  @ApiOperation({
    summary: 'Delete a tenant.Just admin can perform this operation',
  })
  async deleteTenant(@Param('id') id: string) {
    const res = await this.tenantMange.deleteTenant(id);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Tenant deleted successfully',
      data: res,
    });
  }
}
