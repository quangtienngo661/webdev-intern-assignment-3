import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { SubjectRegistry } from '../subjects/subject.registry';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  const prisma = {
    $queryRawUnsafe: jest.fn(),
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        SubjectRegistry,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(ReportsService);
    jest.clearAllMocks();
  });

  it('normalizes score level counts to numbers', async () => {
    prisma.$queryRawUnsafe.mockResolvedValue([
      {
        key: 'toan',
        name: 'Toán',
        excellent: 2n,
        good: 3n,
        average: 4n,
        poor: 1n,
        total: 10n,
      },
    ]);

    await expect(service.getScoreLevels()).resolves.toEqual([
      {
        key: 'toan',
        name: 'Toán',
        total: 10,
        levels: {
          excellent: 2,
          good: 3,
          average: 4,
          poor: 1,
        },
      },
    ]);
  });

  it('caps top group A limit and rounds totals', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        sbd: '01000001',
        toan: 9.2,
        vatLi: 8.8,
        hoaHoc: 9.15,
        total: 27.1500000001,
      },
    ]);

    await expect(service.getTopGroupA(500)).resolves.toEqual([
      {
        sbd: '01000001',
        toan: 9.2,
        vatLi: 8.8,
        hoaHoc: 9.15,
        total: 27.15,
      },
    ]);
  });
});
