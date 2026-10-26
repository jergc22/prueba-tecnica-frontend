export default function ProductImage({ product }) {
  return (
    <div className="product-image">
      <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
    </div>
  )
}
