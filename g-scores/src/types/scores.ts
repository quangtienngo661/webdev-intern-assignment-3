export type SubjectScore = {
  key: string
  name: string
  score: number | null
}

export type ScoreResult = {
  sbd: string
  maNgoaiNgu: string | null
  subjects: SubjectScore[]
}

export type ScoreLevelKey = 'excellent' | 'good' | 'average' | 'poor'

export type ScoreReport = {
  key: string
  name: string
  total: number
  levels: Record<ScoreLevelKey, number>
}

export type TopGroupAStudent = {
  sbd: string
  toan: number
  vatLi: number
  hoaHoc: number
  total: number
}

export type ScoreLevelDefinition = {
  key: ScoreLevelKey
  label: string
  color: string
}
