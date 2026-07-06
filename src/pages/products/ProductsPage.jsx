import { useState, useEffect, useMemo } from 'react';
import { productApi } from '../../api/productApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/ui/ProductCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

export default function ProductsPage() {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [wallet, setWallet] = useState(user?.wallet_balance ?? 0);
  const [buying, setBuying] = useState(null);   // product being purchased
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyMsg, setBuyMsg] = useState('');

  useEffect(() => {
    productApi.getAll()
      .then(r => setProducts(r.data.products || []))
      .catch(() => { })
      .finally(() => setLoading(false));

    if (user?.id) {
      userApi.getWallet(user.id).then(r => setWallet(r.data.walletBalance)).catch(() => { });
    }
  }, [user?.id]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() =>
    products.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    }),
    [products, category, search]
  );

  const handleBuy = async () => {
    if (!buying) return;
    if (wallet < buying.price) { setBuyMsg('Insufficient wallet balance'); return; }
    setBuyLoading(true);
    setBuyMsg('');
    try {
      const res = await userApi.deductWallet(user.id, buying.price);
      const newBalance = res.data.walletBalance;
      setWallet(newBalance);
      updateUser({ wallet_balance: newBalance });
      setBuyMsg(`✅ Purchased "${buying.name}" successfully!`);
      setTimeout(() => { setBuying(null); setBuyMsg(''); }, 2000);
    } catch (err) {
      setBuyMsg(err.response?.data?.detail || 'Purchase failed');
    } finally {
      setBuyLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>🛒 Products</h1>
          <p>{filtered.length} products available</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem',
          fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.9rem'
        }}>
          💰 {formatCurrency(wallet)}
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          id="product-search"
          className="form-input"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
      </div>

      {/* Category Filters */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            className={`filter-tab${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={setBuying}
              canBuy={wallet >= product.price}
            />
          ))}
        </div>
      )}

      {/* Buy Confirm Modal */}
      {buying && (
        <Modal title="Confirm Purchase" onClose={() => { setBuying(null); setBuyMsg(''); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
              <h3>{buying.name}</h3>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent)', marginTop: '0.5rem' }}>
                {formatCurrency(buying.price)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.87rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Wallet Balance</span>
              <span style={{ fontWeight: 700, color: wallet >= buying.price ? 'var(--color-accent)' : 'var(--color-danger)' }}>
                {formatCurrency(wallet)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.87rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>After Purchase</span>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                {formatCurrency(wallet - buying.price)}
              </span>
            </div>

            {buyMsg && (
              <div style={{
                padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.87rem', textAlign: 'center',
                background: buyMsg.startsWith('✅') ? 'rgba(6,214,160,0.1)' : 'rgba(255,77,109,0.1)',
                color: buyMsg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)',
                border: `1px solid ${buyMsg.startsWith('✅') ? 'rgba(6,214,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
              }}>
                {buyMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" fullWidth onClick={() => { setBuying(null); setBuyMsg(''); }} id="cancel-buy-btn">
                Cancel
              </Button>
              <Button
                variant="accent"
                fullWidth
                loading={buyLoading}
                onClick={handleBuy}
                disabled={wallet < buying.price}
                id="confirm-buy-btn"
              >
                Confirm Buy
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
