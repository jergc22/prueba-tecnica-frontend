import { useCallback, useEffect, useState } from 'react'

/**
 * Ejecuta `load` (debe ser estable: useCallback o función de módulo) y expone
 * { data, error, loading, reload }. Ignora respuestas de ejecuciones ya obsoletas.
 */
export function useAsync(load) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ load: null, attempt: -1, data: null, error: null })

  useEffect(() => {
    let cancelled = false
    load()
      .then((data) => {
        if (!cancelled) setResult({ load, attempt, data, error: null })
      })
      .catch((error) => {
        if (!cancelled) setResult({ load, attempt, data: null, error })
      })
    return () => {
      cancelled = true
    }
  }, [load, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const loading = result.load !== load || result.attempt !== attempt

  return { data: loading ? null : result.data, error: loading ? null : result.error, loading, reload }
}
