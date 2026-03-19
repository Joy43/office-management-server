// ---generate template dashboard data for staff dashboard service
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma';
import { HuddleFilterDto } from '../dto/huddle-filter.dto';

@Injectable()
export class StaffMySessionsService {
  constructor(private readonly prisma: PrismaService) {}

  //   -----------GET MY Huddle Sessions --------------------
  async getMyHaddle(staffId: string, filterDto: HuddleFilterDto) {
    const { page = 1, limit = 10, search } = filterDto;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: Prisma.HuddleWhereInput = {
      OR: [
        {
          membersParticipating: {
            some: { id: staffId },
          },
        },
        {
          creatorId: staffId,
        },
      ],
    };

    if (search) {
      whereClause.OR = whereClause.OR?.map((condition) => ({
        ...condition,
        topic: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const [total, huddles, summary] = await Promise.all([
      this.prisma.client.huddle.count({ where: whereClause }),

      this.prisma.client.huddle.findMany({
        where: whereClause,
        include: {
          creator: {
            select: { id: true, name: true, email: true, profilePicture: true },
          },
          branch: {
            select: { id: true, branchName: true },
          },
          membersParticipating: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),

      // ---------------  participated-----------------------
      this.prisma.client.huddle.groupBy({
        by: ['HuddleStatus'],
        where: whereClause,
        _count: true,
      }),
    ]);

    return {
      data: huddles,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },

      summary,
    };
  }
}
