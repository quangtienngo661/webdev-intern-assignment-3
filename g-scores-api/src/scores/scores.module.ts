import { Module } from '@nestjs/common';

import { SubjectsModule } from '../subjects/subjects.module';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';

@Module({
  imports: [SubjectsModule],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
