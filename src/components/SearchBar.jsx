export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar por marca o modelo"
      aria-label="Buscar por marca o modelo"
    />
  )
}
