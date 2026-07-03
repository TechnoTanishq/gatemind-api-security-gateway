import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

/**
 * Single place that decides which of loading / error / empty / content
 * to render, based on the status object returned by useFetch.
 */
export default function DataState({
  isLoading,
  isError,
  isEmpty,
  error,
  onRetry,
  loadingRows = 4,
  emptyTitle,
  emptyDescription,
  children,
}) {
  if (isLoading) return <LoadingState rows={loadingRows} />
  if (isError) return <ErrorState message={error} onRetry={onRetry} />
  if (isEmpty) return <EmptyState title={emptyTitle} description={emptyDescription} />
  return children
}
