import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardData } from '../services/api'
import type { ScoreReport, TopGroupAStudent } from '../types/scores'

export function useDashboardData() {
  const [reports, setReports] = useState<ScoreReport[]>([])
  const [topStudents, setTopStudents] = useState<TopGroupAStudent[]>([])
  const [dashboardError, setDashboardError] = useState('')
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    setIsDashboardLoading(true)
    setDashboardError('')

    try {
      const data = await fetchDashboardData()

      setReports(data.reports)
      setTopStudents(data.topStudents)
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : 'Không tải được dữ liệu dashboard',
      )
    } finally {
      setIsDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    fetchDashboardData()
      .then((data) => {
        if (!isMounted) {
          return
        }

        setReports(data.reports)
        setTopStudents(data.topStudents)
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setDashboardError(
          error instanceof Error
            ? error.message
            : 'Không tải được dữ liệu dashboard',
        )
      })
      .finally(() => {
        if (isMounted) {
          setIsDashboardLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    dashboardError,
    isDashboardLoading,
    loadDashboard,
    reports,
    topStudents,
  }
}
