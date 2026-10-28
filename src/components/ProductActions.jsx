import { useState } from 'react'

// Con una sola opción se muestra y queda seleccionada por defecto.
function initialSelection(options) {
  return options.length === 1 ? options[0].code : null
}

function OptionGroup({ legend, name, options, selected, onSelect }) {
  return (
    <fieldset className="options">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option.code} className="options__item">
          <input
            type="radio"
            name={name}
            value={option.code}
            checked={selected === option.code}
            onChange={() => onSelect(option.code)}
          />
          <span>{option.name}</span>
        </label>
      ))}
    </fieldset>
  )
}

export default function ProductActions({ colors, storages, onAdd, adding = false, purchasable = true }) {
  const [storageCode, setStorageCode] = useState(() => initialSelection(storages))
  const [colorCode, setColorCode] = useState(() => initialSelection(colors))

  // Sin precio no se vende; sin opciones de color o almacenamiento no hay códigos que enviar.
  const available = purchasable && colors.length > 0 && storages.length > 0
  const selectionComplete = storageCode !== null && colorCode !== null
  const canAdd = available && selectionComplete
  const hint = available
    ? 'Elige almacenamiento y color para añadir el producto.'
    : 'Este producto no está disponible para la venta.'

  return (
    <form
      className="actions"
      onSubmit={(event) => {
        event.preventDefault()
        if (canAdd && !adding) onAdd({ colorCode, storageCode })
      }}
    >
      <OptionGroup legend="Almacenamiento" name="storage" options={storages} selected={storageCode} onSelect={setStorageCode} />
      <OptionGroup legend="Color" name="color" options={colors} selected={colorCode} onSelect={setColorCode} />
      {/* Mientras se añade se usa aria-disabled y no disabled: un botón disabled pierde el foco del teclado. */}
      <button
        type="submit"
        className="actions__add"
        disabled={!canAdd}
        aria-disabled={adding || undefined}
        aria-describedby={canAdd ? undefined : 'actions-hint'}
      >
        {adding ? 'Añadiendo…' : 'Añadir'}
      </button>
      {!canAdd && (
        <p id="actions-hint" className="actions__hint">
          {hint}
        </p>
      )}
    </form>
  )
}
