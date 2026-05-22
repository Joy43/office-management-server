import { GetUser, ValidateClientAdmin } from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AssignManagersToBranchDto } from '../dto/assign-managers-to-branch.dto';
import { CreateBranchDto } from '../dto/create-branch-management.dto';
import { GetBranchesDto } from '../dto/get-branches.dto';
import { UpdateBranchManagementDto } from '../dto/update-branch-management.dto';
import { BranchManagementService } from '../service/branch-management.service';

@Controller('branch')
@ApiTags('Client Admin ---------------- Branch Management ')
export class BranchManagementController {
  constructor(
    private readonly branchManagementService: BranchManagementService,
  ) {}

  @Post('create-branch')
  @ValidateClientAdmin()
  @ApiBearerAuth()
  async createBranch(
    @GetUser('sub') userId: string,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    return this.branchManagementService.createBranch(createBranchDto, userId);
  }
  //  ----------------- Assign/replace managers for a branch------------------
  @ApiOperation({
    summary:
      'Assign/replace managers for a branch (provide array of manager IDs || provide branch id params)',
  })
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @Post(':id/assign-managers')
  async assignManagers(
    @Param('id') id: string,
    @Body() dto: AssignManagersToBranchDto,
  ) {
    return this.branchManagementService.assignManagers(id, dto);
  }
  // --------------- Get all Branches------------------
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Branches' })
  @Get('get-all-branches')
  findAll(@Query() query: GetBranchesDto) {
    return this.branchManagementService.findAll(query);
  }
  // --------------- Get a single Branch------------------
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single Branch by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchManagementService.findOne(id);
  }
  // ------------- Branch owner----------------------
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Branch' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBranchManagementDto: UpdateBranchManagementDto,
  ) {
    return this.branchManagementService.update(id, updateBranchManagementDto);
  }

  // ----------------get their own branch users------------------
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'users get || Get all users in a Branch || inter branch id',
  })
  @Get(':id/users')
  findAllUsersInBranch(@Param('id') id: string) {
    return this.branchManagementService.findAllUsersInBranch(id);
  }

  // ----------------get their own branch managers------------------
  @ValidateClientAdmin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'managers get || Get all managers in a Branch || inter branch id',
  })
  @Get(':id/managers')
  findAllManagersInBranch(@Param('id') id: string) {
    return this.branchManagementService.findAllManagersInBranch(id);
  }
  // -------------- Delete a Branch----------------------
  @ApiOperation({ summary: 'Delete a Branch' })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchManagementService.remove(id);
  }
}
