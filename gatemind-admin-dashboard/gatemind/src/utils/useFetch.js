import { useCallback, useEffect, useState } from 'react'

/**
 * Wraps any async fetcher with consistent loading / error / empty states
 * so every card, chart, and table gets the same UX contract for free.
 *
 * isEmpty: optional custom check for what counts as "no data" for this
 * particular shape of response (array vs object vs nested list).
 */
export function useFetch(fetcher, deps = [], isEmpty = defaultIsEmpty) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState(null)

  const run = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetcher()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message || 'Failed to load data.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    const cleanup = run()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return {
    data,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && isEmpty(data),
    refetch: run,
  }
}

function defaultIsEmpty(data) {
  if (data == null) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') return Object.keys(data).length === 0
  return false
}
