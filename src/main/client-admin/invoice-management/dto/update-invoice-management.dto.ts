import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceManagementDto } from './create-invoice-management.dto';

export class UpdateInvoiceManagementDto extends PartialType(CreateInvoiceManagementDto) {}
