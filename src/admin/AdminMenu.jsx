import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X, Edit3, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

export default function AdminMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurants, menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', nameHi: '', price: '', image: '', category: '', isVeg: true,
    isAvailable: true, isBestseller: false, description: ''
  });

  const restaurant = restaurants.find(r => r.id === restaurantId);
  const items = menuItems[restaurantId] || [];

  if (!restaurant) {
    return (
      <div className="admin-container">
        <h2>Restaurant not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/restaurants')}>Go Back</button>
      </div>
    );
  }

  // Group by category
  const categories = [...new Set(items.map(i => i.category))];

  const handleAdd = () => {
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    addMenuItem(restaurantId, {
      ...form,
      price: parseInt(form.price),
      isAvailable: true
    });
    toast.success('Item added!');
    setForm({ name: '', nameHi: '', price: '', image: '', category: '', isVeg: true, isAvailable: true, isBestseller: false, description: '' });
    setShowForm(false);
  };

  return (
    <div className="admin-container" style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/admin/restaurants')} style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>{restaurant.name}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Menu Management • {items.length} items</p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Item</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card fade-in" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Add Menu Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Item Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Name in Hindi" value={form.nameHi} onChange={e => setForm({...form, nameHi: e.target.value})} />
            <input type="number" placeholder="Price (₹) *" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            <input placeholder="Category (e.g., Main Course)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            <input placeholder="Short description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm({...form, isVeg: e.target.checked})} style={{ width: 'auto' }} />
              Vegetarian
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.isBestseller} onChange={e => setForm({...form, isBestseller: e.target.checked})} style={{ width: 'auto' }} />
              Bestseller
            </label>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleAdd}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      )}

      {/* Menu items by category */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <h3>No menu items yet</h3>
          <p>Click "Add Item" to add your first menu item</p>
        </div>
      ) : categories.map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>
            {cat} ({items.filter(i => i.category === cat).length})
          </h3>
          {items.filter(i => i.category === cat).map(item => (
            <div key={item.id} className="card" style={{
              display: 'flex',
              gap: 12,
              padding: 12,
              marginBottom: 8,
              alignItems: 'center',
              opacity: item.isAvailable ? 1 : 0.5
            }}>
              <div className={`veg-badge ${item.isVeg ? '' : 'nonveg'}`} />
              {item.image && (
                <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</span>
                  {item.isBestseller && <span className="bestseller-tag" style={{ fontSize: 9 }}>★ Best</span>}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{formatPrice(item.price)}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    updateMenuItem(restaurantId, item.id, { isAvailable: !item.isAvailable });
                    toast.success(item.isAvailable ? 'Item marked unavailable' : 'Item marked available');
                  }}
                  style={{ background: 'none', color: item.isAvailable ? 'var(--success)' : 'var(--text-light)', display: 'flex' }}
                >
                  {item.isAvailable ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this item?')) {
                      deleteMenuItem(restaurantId, item.id);
                      toast.success('Item deleted');
                    }
                  }}
                  style={{ background: 'none', color: 'var(--danger)', display: 'flex' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
