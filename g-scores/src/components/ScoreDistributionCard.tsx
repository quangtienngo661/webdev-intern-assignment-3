import { useMemo } from 'react'
import { BarChart3, LoaderCircle } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { scoreLevels } from '../constants/scoreLevels'
import type { ScoreReport } from '../types/scores'

type ScoreDistributionCardProps = {
  isLoading: boolean
  reports: ScoreReport[]
}

export function ScoreDistributionCard({
  isLoading,
  reports,
}: ScoreDistributionCardProps) {
  const chartData = useMemo(
    () =>
      reports.map((report) => ({
        average: report.levels.average,
        excellent: report.levels.excellent,
        good: report.levels.good,
        name: report.name,
        poor: report.levels.poor,
      })),
    [reports],
  )

  const totalReportedScores = useMemo(
    () => reports.reduce((sum, report) => sum + report.total, 0),
    [reports],
  )

  return (
    <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-950">Phân bố điểm</h2>
            <p className="text-sm text-gray-500">Theo từng môn thi</p>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          Tổng lượt điểm:{' '}
          <span className="font-semibold">
            {totalReportedScores.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>

      <div className="h-[360px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Đang tải thống kê
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 12, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number'
                    ? value.toLocaleString('vi-VN')
                    : String(value ?? '')
                }
              />
              <Legend />
              {scoreLevels.map((level) => (
                <Bar
                  key={level.key}
                  dataKey={level.key}
                  name={level.label}
                  stackId="score-levels"
                  fill={level.color}
                  radius={level.key === 'poor' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Chưa có dữ liệu thống kê
          </div>
        )}
      </div>
    </div>
  )
}
