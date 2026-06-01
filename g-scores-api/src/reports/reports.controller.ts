import { Controller, Get, Query } from '@nestjs/common';

import { TopGroupAQueryDto } from './dto/top-group-a-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('score-levels')
  getScoreLevels() {
    return this.reportsService.getScoreLevels();
  }

  @Get('top-group-a')
  getTopGroupA(@Query() query: TopGroupAQueryDto) {
    return this.reportsService.getTopGroupA(query.limit ?? 10);
  }
}
