export type ScoreField =
  | 'toan'
  | 'nguVan'
  | 'ngoaiNgu'
  | 'vatLi'
  | 'hoaHoc'
  | 'sinhHoc'
  | 'lichSu'
  | 'diaLi'
  | 'gdcd';

export class ScoreSubject {
  constructor(
    readonly key: string,
    readonly name: string,
    readonly field: ScoreField,
    readonly dbColumn: string,
  ) {}
}
