import { ValidateClientAdmin } from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserClientAdminDto } from '../dto/create-user-management.dto';
import { UserManagementService } from '../service/user-management.service';

@Controller('client-admin/user-management')
@ApiTags('Client Admin-------------------  Users Management')
@ValidateClientAdmin()
@ApiBearerAuth()
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  // ------------------ create user client admin ------------------
  @ApiOperation({
    summary:
      'Create a new user account (default password: 12345678, verified by default) User role selected. when role select MANAGER , then auto assign branch  as id wise',
  })
  @Post('create-user')
  async createUserClientAdmin(
    @Body() createUserClientAdminDto: CreateUserClientAdminDto,
  ) {
    return this.userManagementService.createUserClientAdmin(
      createUserClientAdminDto,
    );
  }

  // ------------------ get all users client admin ------------------
  @ApiOperation({ summary: 'Get a single user by ID' })
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.userManagementService.findOne(id);
  }

  // ------------------ update user client admin ------------------
  @ApiOperation({ summary: 'Update a user' })
  @Patch('update-user/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserManagementDto: CreateUserClientAdminDto,
  ) {
    return this.userManagementService.update(id, updateUserManagementDto);
  }

  // ------------------ delete user client admin ------------------
  @ApiOperation({ summary: 'Delete a user' })
  @Delete('user-delete/:id')
  remove(@Param('id') id: string) {
    return this.userManagementService.remove(id);
  }
}
