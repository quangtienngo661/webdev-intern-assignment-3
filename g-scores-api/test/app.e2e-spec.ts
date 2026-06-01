import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

type ScoreLookupBody = {
  sbd: string;
  subjects: Array<{
    key: string;
    name: string;
    score: number | null;
  }>;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = {
    score: {
      findUnique: jest.fn(),
    },
    $queryRawUnsafe: jest.fn(),
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      name: 'G-Scores API',
      status: 'ok',
    });
  });

  it('/scores/:sbd rejects invalid registration numbers', () => {
    return request(app.getHttpServer()).get('/scores/abc').expect(400);
  });

  it('/scores/:sbd returns 404 for missing scores', () => {
    prisma.score.findUnique.mockResolvedValue(null);

    return request(app.getHttpServer()).get('/scores/99999999').expect(404);
  });

  it('/scores/:sbd returns score details', () => {
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

    return request(app.getHttpServer())
      .get('/scores/01000001')
      .expect(200)
      .expect((response) => {
        const body = response.body as ScoreLookupBody;

        expect(body.sbd).toBe('01000001');
        expect(body.subjects.find((subject) => subject.key === 'toan')).toEqual(
          {
            key: 'toan',
            name: 'Toán',
            score: 8.4,
          },
        );
        expect(
          body.subjects.find((subject) => subject.key === 'hoa_hoc'),
        ).toEqual({
          key: 'hoa_hoc',
          name: 'Hóa học',
          score: 5.25,
        });
      });
  });

  it('/reports/score-levels returns subject level statistics', () => {
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

    return request(app.getHttpServer())
      .get('/reports/score-levels')
      .expect(200)
      .expect([
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

  it('/reports/top-group-a returns top students', () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        sbd: '01000001',
        toan: 9.2,
        vatLi: 8.8,
        hoaHoc: 9.15,
        total: 27.15,
      },
    ]);

    return request(app.getHttpServer())
      .get('/reports/top-group-a?limit=1')
      .expect(200)
      .expect([
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
