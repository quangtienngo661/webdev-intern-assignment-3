import type { FormEventHandler } from 'react'
import { LoaderCircle, Search, UserRoundSearch } from 'lucide-react'
import type { ScoreResult } from '../types/scores'
import { formatScore } from '../utils/formatScore'

type ScoreLookupCardProps = {
  isSearching: boolean
  onQueryChange: (query: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  query: string
  result: ScoreResult | null
  searchError: string
}

export function ScoreLookupCard({
  isSearching,
  onQueryChange,
  onSubmit,
  query,
  result,
  searchError,
}: ScoreLookupCardProps) {
  const unavailableSubjects =
    result?.subjects.filter((subject) => subject.score === null).length ?? 0

  return (
    <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
          <UserRoundSearch className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-950">Tra cứu điểm</h2>
          <p className="text-sm text-gray-500">Nhập số báo danh</p>
        </div>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="registration-number">
          Số báo danh
        </label>
        <input
          id="registration-number"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          inputMode="numeric"
          maxLength={8}
          placeholder="01000001"
          className="h-11 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
          Tra cứu
        </button>
      </form>

      {searchError ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {searchError}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500">Số báo danh</p>
              <p className="text-2xl font-semibold text-gray-950">{result.sbd}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              Mã ngoại ngữ:{' '}
              <span className="font-semibold">{result.maNgoaiNgu ?? '-'}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Môn</th>
                  <th className="px-3 py-2 text-right font-semibold">Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {result.subjects.map((subject) => (
                  <tr key={subject.key}>
                    <td className="px-3 py-2 text-gray-700">{subject.name}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-950">
                      {formatScore(subject.score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {unavailableSubjects} môn không có dữ liệu điểm.
          </p>
        </div>
      ) : null}
    </div>
  )
}
