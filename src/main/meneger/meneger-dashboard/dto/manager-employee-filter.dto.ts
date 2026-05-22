import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum EmployeeStatusFilter {
  GREAT = 'Great',
  NEEDS = 'Needs',
  BAD = 'Bad',
  ALL = 'All',
}

export class ManagerEmployeeFilterDto {
  @ApiPropertyOptional({
    description: 'Search by employee name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  searchName?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: EmployeeStatusFilter,
    example: EmployeeStatusFilter.GREAT,
  })
  @IsOptional()
  @IsEnum(EmployeeStatusFilter)
  status?: EmployeeStatusFilter;

  //   @ApiPropertyOptional({
  //     description: 'Filter by assigned trainer ID',
  //     example: 'uuid-trainer-id',
  //   })
  //   @IsOptional()
  //   @IsString()
  //   assignedTrainerId?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
