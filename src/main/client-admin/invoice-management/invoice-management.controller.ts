import { GetUser, ValidateClientAdmin } from '@/core/jwt/jwt.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceManagementService } from './invoice-management.service';
import { GetClientAdminPaymentHistoryDto } from './dto/get-payment-history-client-admin.dto';

@ApiTags('Client Admin ---------------- Invoice Management')
@Controller('invoice-management')
export class InvoiceManagementController {
  constructor(
    private readonly invoiceManagementService: InvoiceManagementService,
  ) {}
  // ----------- invoice management get their payment history----
  @ApiOperation({
    summary: 'Get all payment history owned by the Client Admin',
  })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Get('payment-history-client-admin')
  findAllPaymentHistory(@GetUser('sub') userId: string,
@Query() query:GetClientAdminPaymentHistoryDto
) {
    return this.invoiceManagementService.findAllPaymentHistory(userId,query);
  }

  // ---------get details of a particular invoice----------
  @ApiOperation({ summary: 'Get invoice details by ID' })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Get(':id/details-invoice-client-admin')
  getDetailsPaymentById(
    @Param('id') id: string,
    @GetUser('sub') userId: string,
  ) {
    return this.invoiceManagementService.getDetailsPaymentById(id, userId);
  }

  // --------------get their own tenant subscription plan details & other separate show details----
  @ApiOperation({
    summary:
      'Get tenant subscription plan details and other details owned by the tenant',
  })
  @ApiBearerAuth()
  @ValidateClientAdmin()
  @Get('tenant-subscription-plan-client-admin')
  getTenantSubscriptionPlan(@GetUser('sub') userId: string) {
    return this.invoiceManagementService.getTenantSubscriptionPlan(userId);
  }
}
