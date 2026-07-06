import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ product, onBuy, canBuy }) {
  const outOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-card-header">
        <span className="product-category">{product.category}</span>
        <span className={`badge ${outOfStock ? 'badge-warning' : 'badge-success'}`}>
          {outOfStock ? 'Out of Stock' : `${product.stock} left`}
        </span>
      </div>

      <div className="product-emoji">🥛</div>

      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
        <div className="product-price">{formatCurrency(product.price)}</div>
      </div>

      <button
        className={`btn btn-accent btn-md btn-full${(!canBuy || outOfStock) ? ' btn-disabled' : ''}`}
        disabled={!canBuy || outOfStock}
        onClick={() => onBuy(product)}
        id={`buy-product-${product.id}`}
      >
        {outOfStock ? 'Out of Stock' : !canBuy ? 'Insufficient Balance' : 'Buy Now'}
      </button>
    </div>
  );
}
