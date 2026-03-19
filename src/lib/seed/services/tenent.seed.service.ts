import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TenantStatus } from '@prisma';

@Injectable()
export class TenantSeedService implements OnModuleInit {
  private readonly logger = new Logger(TenantSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): Promise<void> {
    return this.seedTenants();
  }

  async seedTenants(): Promise<void> {
    const defaultTenants = [
      {
        companyName: 'Acme Corporation',
        subdomain: 'acme',
        companyEmail: 'admin@acme.com',
        status: TenantStatus.ACTIVE,
        locale: 'en',
        timezone: 'Africa/Accra',
      },
      {
        companyName: 'TechStart Inc',
        subdomain: 'techstart',
        companyEmail: 'admin@techstart.com',
        status: TenantStatus.ACTIVE,
        locale: 'en',
        timezone: 'Africa/Accra',
      },
      {
        companyName: 'Global Solutions Ltd',
        subdomain: 'globalsolutions',
        companyEmail: 'admin@globalsolutions.com',
        status: TenantStatus.ACTIVE,
        locale: 'en',
        timezone: 'Africa/Accra',
      },
    ];

    for (const tenantData of defaultTenants) {
      const tenantExists = await this.prisma.client.tenant.findFirst({
        where: {
          OR: [
            { companyEmail: tenantData.companyEmail },
            { subdomain: tenantData.subdomain },
          ],
        },
      });

      // * Create tenant if it doesn't exist
      if (!tenantExists) {
        await this.prisma.client.tenant.create({
          data: tenantData,
        });
        this.logger.log(
          `[CREATE] Tenant created: ${tenantData.companyName} (${tenantData.subdomain})`,
        );
      } else {
        // * Update tenant if it already exists
        await this.prisma.client.tenant.update({
          where: {
            id: tenantExists.id,
          },
          data: {
            status: tenantData.status,
            locale: tenantData.locale,
            timezone: tenantData.timezone,
          },
        });
        this.logger.log(
          `[UPDATE] Tenant updated: ${tenantData.companyName} (${tenantData.subdomain})`,
        );
      }
    }

    this.logger.log('[COMPLETE] Tenant seeding completed');
  }
}
