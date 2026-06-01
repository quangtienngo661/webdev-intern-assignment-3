import { Injectable } from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubjectRegistry } from '../subjects/subject.registry';

type ScoreLevelRow = {
  key: string;
  name: string;
  excellent: bigint;
  good: bigint;
  average: bigint;
  poor: bigint;
  total: bigint;
};

type TopGroupARow = {
  sbd: string;
  toan: number;
  vatLi: number;
  hoaHoc: number;
  total: number;
};

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjects: SubjectRegistry,
  ) {}

  async getScoreLevels() {
    const rows = await this.prisma.$queryRawUnsafe<ScoreLevelRow[]>(
      this.buildScoreLevelsQuery(),
    );

    return rows.map((row) => ({
      key: row.key,
      name: row.name,
      total: Number(row.total),
      levels: {
        excellent: Number(row.excellent),
        good: Number(row.good),
        average: Number(row.average),
        poor: Number(row.poor),
      },
    }));
  }

  async getTopGroupA(limit = 10) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const rows = await this.prisma.$queryRaw<TopGroupARow[]>(Prisma.sql`
      SELECT
        "sbd",
        "toan",
        "vat_li" AS "vatLi",
        "hoa_hoc" AS "hoaHoc",
        ("toan" + "vat_li" + "hoa_hoc")::double precision AS "total"
      FROM "scores"
      WHERE "toan" IS NOT NULL
        AND "vat_li" IS NOT NULL
        AND "hoa_hoc" IS NOT NULL
      ORDER BY "total" DESC, "sbd" ASC
      LIMIT ${safeLimit}
    `);

    return rows.map((row) => ({
      ...row,
      total: Number(row.total.toFixed(2)),
    }));
  }

  private buildScoreLevelsQuery() {
    return this.subjects
      .getAll()
      .map((subject, index) => {
        const column = `"${subject.dbColumn}"`;

        return `
          SELECT
            ${index} AS "ordinal",
            '${subject.key}' AS "key",
            '${subject.name}' AS "name",
            COUNT(*) FILTER (WHERE ${column} >= 8) AS "excellent",
            COUNT(*) FILTER (WHERE ${column} < 8 AND ${column} >= 6) AS "good",
            COUNT(*) FILTER (WHERE ${column} < 6 AND ${column} >= 4) AS "average",
            COUNT(*) FILTER (WHERE ${column} < 4) AS "poor",
            COUNT(${column}) AS "total"
          FROM "scores"
        `;
      })
      .join(' UNION ALL ')
      .concat(' ORDER BY "ordinal"');
  }
}
