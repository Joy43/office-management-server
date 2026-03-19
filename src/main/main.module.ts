import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientAdminModule } from './client-admin/client-admin.module';

import { ExcutiveModule } from './excutive/excutive.module';
import { MANAGERModule } from './meneger/meneger.module';
import { NotificationModule } from './shared/notification/notification.module';
import { SharedModule } from './shared/shared.module';
import { StaffModule } from './staff/staff.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { TainerAdminModule } from './tainer-admin/tainer-admin.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AuthModule,
    UploadModule,
    NotificationModule,
    SharedModule,
    SuperAdminModule,
    ClientAdminModule,
    MANAGERModule,
    StaffModule,
    TainerAdminModule,
    ExcutiveModule,
  ],
})
export class MainModule {}
