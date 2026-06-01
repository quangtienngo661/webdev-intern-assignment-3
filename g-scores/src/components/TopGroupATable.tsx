import { Trophy } from 'lucide-react'
import { scoreLevels } from '../constants/scoreLevels'
import type { TopGroupAStudent } from '../types/scores'
import { formatScore } from '../utils/formatScore'

type TopGroupATableProps = {
  isLoading: boolean
  students: TopGroupAStudent[]
}

export function TopGroupATable({ isLoading, students }: TopGroupATableProps) {
  return (
    <section className="min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-700">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-950">Top 10 khối A</h2>
            <p className="text-sm text-gray-500">Toán + Vật lí + Hóa học</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {scoreLevels.map((level) => (
            <span
              key={level.key}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700"
            >
              {level.label}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Hạng</th>
              <th className="px-4 py-3 font-semibold">Số báo danh</th>
              <th className="px-4 py-3 text-right font-semibold">Toán</th>
              <th className="px-4 py-3 text-right font-semibold">Vật lí</th>
              <th className="px-4 py-3 text-right font-semibold">Hóa học</th>
              <th className="px-4 py-3 text-right font-semibold">Tổng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  Đang tải bảng xếp hạng
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.sbd} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-950">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {student.sbd}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatScore(student.toan)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatScore(student.vatLi)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatScore(student.hoaHoc)}
                  </td>
                  <td className="px-4 py-3 text-right text-base font-semibold text-gray-950">
                    {student.total.toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  Chưa có dữ liệu xếp hạng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
