import { Module } from '@nestjs/common';

import { SubjectRegistry } from './subject.registry';

@Module({
  providers: [SubjectRegistry],
  exports: [SubjectRegistry],
})
export class SubjectsModule {}
