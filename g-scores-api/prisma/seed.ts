import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { parse } from 'csv-parse';

import { Prisma, PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});
const batchSize = Number(process.env.SEED_BATCH_SIZE ?? 2_000);
const datasetPath = resolve(
  process.cwd(),
  process.env.SEED_FILE ?? '../dataset/diem_thi_thpt_2024.csv',
);

type CsvRow = Record<string, string | undefined>;

const parseNullableScore = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const score = Number(value);
  return Number.isFinite(score) ? score : null;
};

const mapRowToScore = (row: CsvRow): Prisma.ScoreCreateManyInput => ({
  sbd: String(row.sbd ?? '').padStart(8, '0'),
  toan: parseNullableScore(row.toan),
  nguVan: parseNullableScore(row.ngu_van),
  ngoaiNgu: parseNullableScore(row.ngoai_ngu),
  vatLi: parseNullableScore(row.vat_li),
  hoaHoc: parseNullableScore(row.hoa_hoc),
  sinhHoc: parseNullableScore(row.sinh_hoc),
  lichSu: parseNullableScore(row.lich_su),
  diaLi: parseNullableScore(row.dia_li),
  gdcd: parseNullableScore(row.gdcd),
  maNgoaiNgu: row.ma_ngoai_ngu || null,
});

async function flushBatch(batch: Prisma.ScoreCreateManyInput[]) {
  if (batch.length === 0) {
    return 0;
  }

  const result = await prisma.score.createMany({
    data: batch,
    skipDuplicates: true,
  });

  return result.count;
}

async function main() {
  if (process.env.SEED_RESET === 'true') {
    await prisma.score.deleteMany();
  }

  const existingRows = await prisma.score.count();
  const shouldForceSeed = process.env.SEED_FORCE === 'true';

  if (existingRows > 0 && !shouldForceSeed && process.env.SEED_RESET !== 'true') {
    console.log(
      `Seed skipped. Database already has ${existingRows.toLocaleString()} score rows.`,
    );
    return;
  }

  if (!existsSync(datasetPath)) {
    throw new Error(`Seed file not found at ${datasetPath}`);
  }

  let batch: Prisma.ScoreCreateManyInput[] = [];
  let inserted = 0;
  let processed = 0;

  const parser = createReadStream(datasetPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );

  for await (const row of parser as AsyncIterable<CsvRow>) {
    batch.push(mapRowToScore(row));
    processed += 1;

    if (batch.length >= batchSize) {
      inserted += await flushBatch(batch);
      batch = [];
    }
  }

  inserted += await flushBatch(batch);
  const total = await prisma.score.count();

  console.log(
    `Seed complete. Processed ${processed.toLocaleString()} rows, inserted ${inserted.toLocaleString()} new rows, database total ${total.toLocaleString()}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
