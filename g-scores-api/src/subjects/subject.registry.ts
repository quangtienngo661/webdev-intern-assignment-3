import { Injectable } from '@nestjs/common';

import { ScoreField, ScoreSubject } from './subject.entity';

@Injectable()
export class SubjectRegistry {
  private readonly subjects = [
    new ScoreSubject('toan', 'Toán', 'toan', 'toan'),
    new ScoreSubject('ngu_van', 'Ngữ văn', 'nguVan', 'ngu_van'),
    new ScoreSubject('ngoai_ngu', 'Ngoại ngữ', 'ngoaiNgu', 'ngoai_ngu'),
    new ScoreSubject('vat_li', 'Vật lí', 'vatLi', 'vat_li'),
    new ScoreSubject('hoa_hoc', 'Hóa học', 'hoaHoc', 'hoa_hoc'),
    new ScoreSubject('sinh_hoc', 'Sinh học', 'sinhHoc', 'sinh_hoc'),
    new ScoreSubject('lich_su', 'Lịch sử', 'lichSu', 'lich_su'),
    new ScoreSubject('dia_li', 'Địa lí', 'diaLi', 'dia_li'),
    new ScoreSubject('gdcd', 'GDCD', 'gdcd', 'gdcd'),
  ] as const;

  getAll() {
    return [...this.subjects];
  }

  getGroupA() {
    return this.subjects.filter((subject) =>
      ['toan', 'vatLi', 'hoaHoc'].includes(subject.field),
    );
  }

  getScore<T extends Record<ScoreField, number | null>>(
    record: T,
    subject: ScoreSubject,
  ) {
    return record[subject.field];
  }
}
