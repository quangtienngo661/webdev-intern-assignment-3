import { Database, RefreshCcw } from 'lucide-react'

type DashboardHeaderProps = {
  isLoading: boolean
  onRefresh: () => void
}

export function DashboardHeader({ isLoading, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
          <Database className="h-4 w-4" aria-hidden="true" />
          THPT Quốc gia 2024
        </div>
        <h1 className="text-3xl font-semibold text-gray-950 sm:text-4xl">
          G-Scores Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Tra cứu điểm theo số báo danh, xem phân bố điểm theo môn và bảng xếp
          hạng khối A.
        </p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCcw
          className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          aria-hidden="true"
        />
        Làm mới
      </button>
    </header>
  )
}
