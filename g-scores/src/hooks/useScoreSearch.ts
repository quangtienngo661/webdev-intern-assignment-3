import { useState } from 'react'
import type { FormEvent } from 'react'
import { fetchScore } from '../services/api'
import type { ScoreResult } from '../types/scores'

export function useScoreSearch() {
  const [query, setQuery] = useState('')
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  async function searchScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedQuery = query.trim()

    if (!/^\d{8}$/.test(normalizedQuery)) {
      setSearchError('Số báo danh phải gồm đúng 8 chữ số')
      setScoreResult(null)
      return
    }

    setIsSearching(true)
    setSearchError('')

    try {
      setScoreResult(await fetchScore(normalizedQuery))
    } catch (error) {
      setScoreResult(null)
      setSearchError(error instanceof Error ? error.message : 'Không tìm thấy kết quả')
    } finally {
      setIsSearching(false)
    }
  }

  return {
    isSearching,
    query,
    scoreResult,
    searchError,
    searchScore,
    setQuery,
  }
}
