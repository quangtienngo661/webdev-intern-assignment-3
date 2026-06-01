export function formatScore(score: number | null) {
  return score === null ? '-' : score.toLocaleString('vi-VN')
}
