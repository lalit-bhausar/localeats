import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, SlidersHorizontal, Leaf, Globe } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import RestaurantCard from '../components/RestaurantCard';
import BottomNav from '../components/BottomNav';

const cuisineFilters = [
  { id: 'all', label: 'All', labelHi: 'सभी' },
  { id: 'veg', label: 'Pure Veg', labelHi: 'शुद्ध शाकाहारी' },
  { id: 'North Indian', label: 'North Indian', labelHi: 'उत्तर भारतीय' },
  { id: 'South Indian', label: 'South Indian', labelHi: 'दक्षिण भारतीय' },
  { id: 'Chinese', label: 'Chinese', labelHi: 'चाइनीज़' },
  { id: 'Fast Food', label: 'Fast Food', labelHi: 'फास्ट फूड' },
  { id: 'Street Food', label: 'Street Food', labelHi: 'स्ट्रीट फूड' },
  { id: 'Biryani', label: 'Biryani', labelHi: 'बिरयानी' },
  { id: 'Beverages', label: 'Beverages', labelHi: 'पेय' }
];

export default function Home() {
  const navigate = useNavigate();
  const { restaurants, t, toggleLang, lang } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  let filtered = restaurants;

  if (activeFilter === 'veg') {
    filtered = filtered.filter(r => r.isVeg);
  } else if (activeFilter !== 'all') {
    filtered = filtered.filter(r => r.cuisine.includes(activeFilter));
  }

  if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'deliveryTime') {
    filtered = [...filtered].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  } else if (sortBy === 'deliveryFee') {
    filtered = [...filtered].sort((a, b) => a.deliveryFee - b.deliveryFee);
  }

  // Put open restaurants first
  filtered = [...filtered].sort((a, b) => (b.isOpen ? 1 : 0) - (a.isOpen ? 1 : 0));

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        background: 'var(--primary)',
        padding: '16px 16px 20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.9 }}>
              <MapPin size={13} /> {t('Delivering to', 'डिलीवरी यहाँ')}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>
              {t('Your Area', 'आपका क्षेत्र')} ▾
            </h2>
          </div>
          <button
            onClick={toggleLang}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Globe size={14} />
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>

        {/* Search bar */}
        <div
          onClick={() => navigate('/search')}
          style={{
            background: 'white',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <Search size={18} color="var(--text-light)" />
          <span style={{ color: 'var(--text-light)', fontSize: 14 }}>
            {t('Search for restaurants or dishes...', 'रेस्तरां या व्यंजन खोजें...')}
          </span>
        </div>
      </div>

      {/* Banner */}
      <div style={{
        margin: '16px 16px 0',
        background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A3D 100%)',
        borderRadius: 14,
        padding: '20px 18px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>
            {t('Welcome to', 'स्वागत है')}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>LocalEats 🍽️</h1>
          <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.4 }}>
            {t(
              'Your favorite local food, delivered to your door!',
              'आपका पसंदीदा स्थानीय खाना, आपके दरवाज़े पर!'
            )}
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          fontSize: 80,
          opacity: 0.15
        }}>🛵</div>
      </div>

      {/* Cuisine filters */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '16px 16px 0',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {cuisineFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: activeFilter === f.id ? 'var(--primary)' : 'white',
              color: activeFilter === f.id ? 'white' : 'var(--text)',
              border: `1.5px solid ${activeFilter === f.id ? 'var(--primary)' : 'var(--border)'}`,
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {f.id === 'veg' && '🌿 '}
            {lang === 'en' ? f.label : f.labelHi}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px 8px'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>
          {t(`${filtered.length} Restaurants`, `${filtered.length} रेस्तरां`)}
        </h3>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '5px 10px',
            fontSize: 12,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'white',
            width: 'auto'
          }}
        >
          <option value="rating">{t('Rating', 'रेटिंग')}</option>
          <option value="deliveryTime">{t('Fastest', 'सबसे तेज़')}</option>
          <option value="deliveryFee">{t('Delivery Fee', 'डिलीवरी शुल्क')}</option>
        </select>
      </div>

      {/* Restaurant list */}
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {filtered.length > 0 ? (
          filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)
        ) : (
          <div className="empty-state">
            <h3>{t('No restaurants found', 'कोई रेस्तरां नहीं मिला')}</h3>
            <p>{t('Try a different filter', 'कोई दूसरा फ़िल्टर आज़माएँ')}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
