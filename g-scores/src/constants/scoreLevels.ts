import type { ScoreLevelDefinition } from '../types/scores'

export const scoreLevels: ScoreLevelDefinition[] = [
  { key: 'excellent', label: '>= 8', color: '#0f766e' },
  { key: 'good', label: '6 - 8', color: '#2563eb' },
  { key: 'average', label: '4 - 6', color: '#d97706' },
  { key: 'poor', label: '< 4', color: '#dc2626' },
]
