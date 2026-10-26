function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Filtra por marca y modelo: todas las palabras escritas deben aparecer en "marca modelo". */
export function filterProducts(products, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return products

  return products.filter((product) => {
    const haystack = normalize(`${product.brand} ${product.model}`)
    return words.every((word) => haystack.includes(word))
  })
}
