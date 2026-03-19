import { Module } from '@nestjs/common';
import { InvoiceManagementService } from './invoice-management.service';
import { InvoiceManagementController } from './invoice-management.controller';

@Module({
  controllers: [InvoiceManagementController],
  providers: [InvoiceManagementService],
})
export class InvoiceManagementModule {}
