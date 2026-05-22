import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MyHabitsSearchDto {
  @ApiPropertyOptional({
    description: 'Search by habit name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // pagination fields
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    default: 10,
  })
  @IsOptional()
  limit?: number;
}
