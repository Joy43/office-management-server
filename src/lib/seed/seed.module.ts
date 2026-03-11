import { Global, Module } from '@nestjs/common';
import { DefaultUsersService } from './services/default.staff.service';
import { FileService } from './services/file.service';
import { SuperAdminService } from './services/super-admin.service';
// import { TenantSeedService } from './services/tenent.seed.service';

@Global()
@Module({
  imports: [],
  providers: [
    SuperAdminService,
    FileService,
    DefaultUsersService,
    // TenantSeedService,
  ],
})
export class SeedModule {}
