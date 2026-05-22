import { ValidateSuperAdmin } from '@/core/jwt/jwt.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PlatformRevenueService } from './platform-revenue.service';
import { RevenueFilterDto, TotalOrderListDto } from './dto/revenueFilter.dto';

@ApiTags('Super Admin--------------Platform Revenue, platform overview')
@Controller('platform-revenue')
export class PlatformRevenueController {
  constructor(
    private readonly platformRevenueService: PlatformRevenueService,
  ) {}

  // --------------------- findAllRevenue ---------------------
  @ApiOperation({
    summary:
      'Get all platform revenues || Super Admin dashboard wORKPLACE Implement',
  })
  @ValidateSuperAdmin()
  @ApiBearerAuth()
  @Get('revenue-dashboard')
  async findAllRevenueDashboard() {
    return await this.platformRevenueService.findAllRevenueDashboard();
  }

  //  --------------------- getPlatformOverview ---------------------
  @ApiOperation({
    summary:
      'Get Platform Overview like total users, total tenants, total revenue etc || Super Admin dashboard PART 1',
  })
  @ValidateSuperAdmin()
  @ApiBearerAuth()
  @Get('platform-overview')
  getPlatformOverview() {
    return this.platformRevenueService.getPlatformOverview();
  }

  // ---------- Selling Source (Donut) ----------
  @Get('selling-source')
  @ValidateSuperAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Selling source (Starter / Growth / Enterprise)' })
  getSellingSource(@Query() dto: RevenueFilterDto) {
    return this.platformRevenueService.getSellingSource(dto);
  }

  // ---------- Revenue Graph (Monthly / Yearly) ----------
  @Get('revenue-graph')
  @ValidateSuperAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revenue graph with monthly / yearly filter' })
  getRevenueGraph(@Query() dto: RevenueFilterDto) {
    return this.platformRevenueService.getRevenueGraph(dto);
  }

  //  ---------------- total order list---------------------
  @ApiOperation({
    summary: 'Get total orders (invoices) list || Super Admin dashboard',
  })
  @ValidateSuperAdmin()
  @ApiBearerAuth()
  @Get('total-orders')
  async getTotalOrders(@Query() dto: TotalOrderListDto) {
    return this.platformRevenueService.getTotalOrdersChart(dto);
  }
}
