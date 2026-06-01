import type {
  ScoreReport,
  ScoreResult,
  TopGroupAStudent,
} from '../types/scores'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  '',
)

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body = (await response.json()) as { message?: string | string[] }

      if (Array.isArray(body.message)) {
        message = body.message.join(', ')
      } else if (body.message) {
        message = body.message
      }
    } catch {
      // Keep the HTTP fallback message when the API does not return JSON.
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export async function fetchScore(sbd: string) {
  return fetchJson<ScoreResult>(`/scores/${sbd}`)
}

export async function fetchDashboardData() {
  const [reports, topStudents] = await Promise.all([
    fetchJson<ScoreReport[]>('/reports/score-levels'),
    fetchJson<TopGroupAStudent[]>('/reports/top-group-a?limit=10'),
  ])

  return { reports, topStudents }
}
