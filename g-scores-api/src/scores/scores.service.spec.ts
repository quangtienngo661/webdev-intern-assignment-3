import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { SubjectRegistry } from '../subjects/subject.registry';
import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;
  const prisma = {
    score: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        SubjectRegistry,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(ScoresService);
    jest.clearAllMocks();
  });

  it('returns a score result with subject metadata', async () => {
    prisma.score.findUnique.mockResolvedValue({
      id: 1,
      sbd: '01000001',
      toan: 8.4,
      nguVan: 6.75,
      ngoaiNgu: 8,
      vatLi: 6,
      hoaHoc: 5.25,
      sinhHoc: 5,
      lichSu: null,
      diaLi: null,
      gdcd: null,
      maNgoaiNgu: 'N1',
    });

    const result = await service.findByRegistrationNumber('01000001');

    expect(result.sbd).toBe('01000001');
    expect(result.maNgoaiNgu).toBe('N1');
    expect(result.subjects.find((subject) => subject.key === 'toan')).toEqual({
      key: 'toan',
      name: 'Toán',
      score: 8.4,
    });
    expect(
      result.subjects.find((subject) => subject.key === 'hoa_hoc'),
    ).toEqual({
      key: 'hoa_hoc',
      name: 'Hóa học',
      score: 5.25,
    });
  });

  it('throws not found for unknown registration numbers', async () => {
    prisma.score.findUnique.mockResolvedValue(null);

    await expect(
      service.findByRegistrationNumber('99999999'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
