import { useState, useEffect } from 'react';
import { productApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const EMPTY_FORM = { name: '', price: '', category: '', description: '', stock: '' };

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErr, setFormErr] = useState({});
  const [saving, setSaving] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    productApi.getAll()
      .then(r => setProducts(r.data.products || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setFormErr({}); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, price: String(p.price), category: p.category, description: p.description || '', stock: String(p.stock) });
    setFormErr({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormErr(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) errs.price = 'Enter valid price';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (form.stock === '' || isNaN(form.stock) || +form.stock < 0) errs.stock = 'Enter valid stock';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErr(errs); return; }

    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      stock: parseInt(form.stock, 10),
    };

    setSaving(true);
    try {
      if (editProduct) {
        const res = await productApi.update(editProduct.id, payload);
        setProducts(prev => prev.map(p => p.id === editProduct.id ? res.data.product : p));
        showMsg('✅ Product updated');
      } else {
        const res = await productApi.create(payload);
        setProducts(prev => [...prev, res.data.product]);
        showMsg('✅ Product created');
      }
      setShowModal(false);
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.detail || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await productApi.delete(delTarget.id);
      setProducts(prev => prev.filter(p => p.id !== delTarget.id));
      setDelTarget(null);
      showMsg('✅ Product deleted');
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.detail || 'Delete failed'));
    } finally {
      setDelLoading(false);
    }
  };

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  if (loading) return <Loader />;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>📦 Products</h1>
          <p>{products.length} products in catalog</p>
        </div>
        <Button id="add-product-btn" variant="primary" onClick={openAdd}>
          + Add Product
        </Button>
      </div>

      {msg && (
        <div style={{
          marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
          background: msg.startsWith('✅') ? 'rgba(6,214,160,0.1)' : 'rgba(255,77,109,0.1)',
          color: msg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)',
          border: `1px solid ${msg.startsWith('✅') ? 'rgba(6,214,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
          fontSize: '0.87rem',
        }}>
          {msg}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>
                    <span style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock === 0 ? 'Out' : p.stock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button id={`edit-product-${p.id}`} variant="ghost" size="sm" onClick={() => openEdit(p)}>✏️ Edit</Button>
                      <Button id={`delete-product-${p.id}`} variant="danger" size="sm" onClick={() => setDelTarget(p)}>🗑</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editProduct ? '✏️ Edit Product' : '➕ Add Product'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input id="product-name" label="Name" name="name" value={form.name} onChange={handleChange} error={formErr.name} placeholder="e.g. Fresh Whole Milk" />
            <Input id="product-category" label="Category" name="category" value={form.category} onChange={handleChange} error={formErr.category} placeholder="e.g. Milk" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input id="product-price" label="Price (₹)" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} error={formErr.price} placeholder="0.00" />
              <Input id="product-stock" label="Stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} error={formErr.stock} placeholder="100" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="product-desc">Description</label>
              <textarea
                id="product-desc"
                name="description"
                className="form-input"
                rows={3}
                placeholder="Short product description..."
                value={form.description}
                onChange={handleChange}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <Button variant="ghost" fullWidth type="button" onClick={() => setShowModal(false)} id="cancel-product-btn">Cancel</Button>
              <Button variant="primary" fullWidth type="submit" loading={saving} id="save-product-btn">
                {editProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {delTarget && (
        <Modal title="⚠ Delete Product" onClose={() => setDelTarget(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p>Delete <strong style={{ color: 'var(--text-primary)' }}>{delTarget.name}</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" fullWidth onClick={() => setDelTarget(null)} id="cancel-delete-product-btn">Cancel</Button>
              <Button variant="danger" fullWidth loading={delLoading} onClick={handleDelete} id="confirm-delete-product-btn">Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
