import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantFilterDto } from '../dto/findTenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

@Injectable()
export class TenantManageService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to fetch tenants', 'Tenant Management')
  async findAll(filter: TenantFilterDto) {
    const { page = 1, limit = 10, search } = filter;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } },
      ];
    }
    const tenants = await this.prisma.client.tenant.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tenants;
  }

  @HandleError('Failed to fetch tenant', 'Tenant Management')
  async findSingleTenant(id: string) {
    const isExist = await this.prisma.client.tenant.findUnique({
      where: { id },

      include: {
        // invoice:{
        //   select:{
        //     amount:true,
        //     currency:true,
        //     dueDate:true,
        //     paidAt:true,
        //     status:true,
        //     subscriptionId:true
        //   }
        // }
        invoice: true,
        users: true,
        branches: true,
        dashboardTemplates: true,
      },
    });
    if (!isExist) {
      throw new Error('Tenant not found');
    }
    return isExist;
  }

  @HandleError('Failed to update tenant', 'Tenant Management')
  async updateTenant(id: string, updateTenantDto: UpdateTenantDto) {
    const tenant = await this.prisma.client.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const { planId, companyEmail, subdomain, companyName } = updateTenantDto;

    if (companyEmail) {
      const emailExists = await this.prisma.client.tenant.findFirst({
        where: {
          companyEmail,
          NOT: { id },
        },
      });

      if (emailExists) {
        throw new ConflictException('Company email already exists');
      }
    }

    if (subdomain) {
      const subdomainExists = await this.prisma.client.tenant.findFirst({
        where: {
          subdomain,
          NOT: { id },
        },
      });

      if (subdomainExists) {
        throw new ConflictException(
          'Subdomain already exists in another tenant',
        );
      }
    }

    const result = await this.prisma.client.$transaction(async (trx) => {
      const updatedTenant = await trx.tenant.update({
        where: { id },
        data: {
          companyName,
          companyEmail,
          subdomain,
        },
      });

      if (planId) {
        await trx.invoice.updateMany({
          where: { tenantId: id },
          data: {
            subscriptionId: planId,
          },
        });
      }

      return updatedTenant;
    });

    return result;
  }

  @HandleError('Failed to delete tenant', 'Tenant Management')
  async deleteTenant(id: string) {
    await this.findSingleTenant(id);
    const deletedTenant = await this.prisma.client.tenant.delete({
      where: { id },
    });
    return deletedTenant;
  }
}
