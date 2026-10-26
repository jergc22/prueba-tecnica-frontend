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

export default function ProductActions({ colors, storages, onAdd, adding = false }) {
  const [storageCode, setStorageCode] = useState(() => initialSelection(storages))
  const [colorCode, setColorCode] = useState(() => initialSelection(colors))

  const canAdd = storageCode !== null && colorCode !== null && !adding

  return (
    <form
      className="actions"
      onSubmit={(event) => {
        event.preventDefault()
        if (canAdd) onAdd({ colorCode, storageCode })
      }}
    >
      <OptionGroup legend="Almacenamiento" name="storage" options={storages} selected={storageCode} onSelect={setStorageCode} />
      <OptionGroup legend="Color" name="color" options={colors} selected={colorCode} onSelect={setColorCode} />
      <button type="submit" className="actions__add" disabled={!canAdd}>
        {adding ? 'Añadiendo…' : 'Añadir'}
      </button>
    </form>
  )
}
