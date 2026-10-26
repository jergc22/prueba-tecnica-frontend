export function Loading({ message = 'Cargando…' }) {
  return (
    <p className="state" role="status">
      {message}
      <span className="state__hint"> La primera petición puede tardar si el servidor estaba inactivo.</span>
    </p>
  )
}

export function ErrorMessage({ message = 'No se han podido cargar los datos.', onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  )
}
