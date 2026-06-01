import { Module } from '@nestjs/common';

import { SubjectsModule } from '../subjects/subjects.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [SubjectsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
