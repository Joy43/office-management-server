import { ApiProperty } from '@nestjs/swagger';

export class EmployeeHabitDto {
  @ApiProperty({ description: 'Habit ID', example: 'uuid' })
  habitId: string;

  @ApiProperty({
    description: 'Habit name/title',
    example: 'Greet 3 customers by name',
  })
  habitName: string;

  @ApiProperty({
    description: 'Habit description',
    example: 'Use customer names when greeting. Names when available',
  })
  habitDescription: string;

  @ApiProperty({ description: 'Completion percentage', example: 60 })
  completionPercentage: number;

  @ApiProperty({ description: 'Current streak', example: 14 })
  streak: number;
}

export class EmployeeDataDto {
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Employee name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Employee email', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'Profile picture URL', nullable: true })
  profilePicture: string | null;

  @ApiProperty({ description: 'Phone number', nullable: true })
  phone: string | null;

  @ApiProperty({
    description: 'Total habits assigned',
    example: 14,
  })
  totalHabits: number;

  @ApiProperty({
    description: 'Overall performance score (out of 5)',
    example: 4.5,
  })
  score: number;

  @ApiProperty({
    description: 'Performance status',
    enum: ['Great', 'Needs', 'Bad'],
    example: 'Great',
  })
  status: 'Great' | 'Needs' | 'Bad';

  @ApiProperty({
    description: 'Assigned trainer information',
    nullable: true,
    type: Object,
    example: { id: 'uuid', name: 'Daniel', profilePicture: 'url' },
  })
  assignedTrainer: {
    id: string;
    name: string;
    profilePicture: string | null;
  } | null;

  @ApiProperty({
    description: 'Employee habits with details',
    type: [EmployeeHabitDto],
  })
  habits: EmployeeHabitDto[];
}

export class ManagerEmployeeResponseDto {
  @ApiProperty({ description: 'Total employees count', example: 50 })
  totalEmployees: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Total pages', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Records per page', example: 10 })
  limit: number;

  @ApiProperty({
    description: 'List of employees with their habit data',
    type: [EmployeeDataDto],
  })
  employees: EmployeeDataDto[];
}
