import { Injectable, NotFoundException } from '@nestjs/common';

import type { Score } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubjectRegistry } from '../subjects/subject.registry';

@Injectable()
export class ScoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjects: SubjectRegistry,
  ) {}

  async findByRegistrationNumber(sbd: string) {
    const score = await this.prisma.score.findUnique({ where: { sbd } });

    if (!score) {
      throw new NotFoundException(
        `No score found for registration number ${sbd}`,
      );
    }

    return this.toResponse(score);
  }

  private toResponse(score: Score) {
    return {
      sbd: score.sbd,
      maNgoaiNgu: score.maNgoaiNgu,
      subjects: this.subjects.getAll().map((subject) => ({
        key: subject.key,
        name: subject.name,
        score: this.subjects.getScore(score, subject),
      })),
    };
  }
}
