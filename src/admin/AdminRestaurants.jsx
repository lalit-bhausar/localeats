import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, ToggleLeft, ToggleRight, Utensils, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';

export default function AdminRestaurants() {
  const navigate = useNavigate();
  const { restaurants, addRestaurant, updateRestaurant } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', nameHi: '', cuisine: '', image: '', rating: 4.0, deliveryTime: '30-40',
    deliveryFee: 20, minOrder: 100, isVeg: false, address: '', phone: '', description: ''
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    addRestaurant({
      ...form,
      cuisine: form.cuisine.split(',').map(c => c.trim()).filter(Boolean),
      rating: parseFloat(form.rating) || 4.0,
      deliveryFee: parseInt(form.deliveryFee) || 0,
      minOrder: parseInt(form.minOrder) || 100,
      totalRatings: 0,
      isOpen: true,
      image: form.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop'
    });
    toast.success('Restaurant added!');
    setShowForm(false);
    setForm({ name: '', nameHi: '', cuisine: '', image: '', rating: 4.0, deliveryTime: '30-40', deliveryFee: 20, minOrder: 100, isVeg: false, address: '', phone: '', description: '' });
  };

  return (
    <div className="admin-container" style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>Manage Restaurants</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Restaurant</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card fade-in" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Add New Restaurant</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Restaurant Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Name in Hindi" value={form.nameHi} onChange={e => setForm({...form, nameHi: e.target.value})} />
            <input placeholder="Cuisines (comma separated)" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} />
            <input placeholder="Phone Number *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            <input placeholder="Delivery Time (e.g., 30-40)" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: e.target.value})} />
            <input type="number" placeholder="Delivery Fee (₹)" value={form.deliveryFee} onChange={e => setForm({...form, deliveryFee: e.target.value})} />
            <input type="number" placeholder="Min Order (₹)" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})} />
            <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ gridColumn: '1 / -1' }} />
            <input placeholder="Short description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ gridColumn: '1 / -1' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm({...form, isVeg: e.target.checked})} style={{ width: 'auto' }} />
              Pure Veg Restaurant
            </label>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleAdd}>
            <Plus size={16} /> Add Restaurant
          </button>
        </div>
      )}

      {/* Restaurant list */}
      {restaurants.map(r => (
        <div key={r.id} className="card" style={{
          display: 'flex',
          gap: 14,
          padding: 14,
          marginBottom: 10,
          alignItems: 'center'
        }}>
          <img
            src={r.image}
            alt={r.name}
            style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</h4>
              {r.isVeg && <span style={{ fontSize: 10, color: 'var(--veg)', fontWeight: 700 }}>PURE VEG</span>}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.cuisine.join(', ')}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--text-light)' }}>
              <span>⭐ {r.rating}</span>
              <span>🕐 {r.deliveryTime}min</span>
              <span>📞 {r.phone}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => navigate(`/admin/menu/${r.id}`)}
              title="Edit menu"
            >
              <Utensils size={14} /> Menu
            </button>
            <button
              onClick={() => {
                updateRestaurant(r.id, { isOpen: !r.isOpen });
                toast.success(r.isOpen ? 'Restaurant closed' : 'Restaurant opened');
              }}
              style={{
                background: 'none',
                color: r.isOpen ? 'var(--success)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center'
              }}
              title={r.isOpen ? 'Click to close' : 'Click to open'}
            >
              {r.isOpen ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
