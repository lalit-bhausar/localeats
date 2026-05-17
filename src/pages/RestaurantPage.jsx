import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bike, ShoppingBag, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import MenuItemCard from '../components/MenuItemCard';
import { formatPrice } from '../utils/helpers';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, menuItems, getCartTotal, getCartCount, cartRestaurant, t } = useApp();
  const [searchMenu, setSearchMenu] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const restaurant = restaurants.find(r => r.id === id);
  const items = menuItems[id] || [];

  if (!restaurant) {
    return (
      <div className="app-container empty-state">
        <h3>{t('Restaurant not found', 'रेस्तरां नहीं मिला')}</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          {t('Go Home', 'होम पर जाएँ')}
        </button>
      </div>
    );
  }

  // Get unique categories
  const categories = ['all', ...new Set(items.map(i => i.category))];

  // Filter items
  let filteredItems = items;
  if (activeCategory !== 'all') {
    filteredItems = filteredItems.filter(i => i.category === activeCategory);
  }
  if (searchMenu) {
    filteredItems = filteredItems.filter(i =>
      i.name.toLowerCase().includes(searchMenu.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchMenu.toLowerCase())
    );
  }

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const showCartBar = cartCount > 0 && cartRestaurant?.id === id;

  return (
    <div className="app-container">
      {/* Header image */}
      <div style={{ position: 'relative', height: 200 }}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7))'
        }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'white',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Restaurant info */}
      <div style={{ padding: '16px', borderBottom: '6px solid var(--bg-gray)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>{restaurant.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {restaurant.cuisine.join(' • ')}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
              {restaurant.address}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="rating-badge" style={{ fontSize: 14, padding: '4px 8px' }}>
              <Star size={13} fill="white" /> {restaurant.rating}
            </span>
            <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>
              {restaurant.totalRatings}+ {t('ratings', 'रेटिंग')}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 20,
          marginTop: 12,
          padding: '10px 0',
          borderTop: '1px solid var(--border-light)',
          fontSize: 13,
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={15} /> {restaurant.deliveryTime} {t('min', 'मिनट')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Bike size={15} /> {formatPrice(restaurant.deliveryFee)} {t('delivery', 'डिलीवरी')}
          </span>
          <span>
            {t('Min order', 'न्यूनतम ऑर्डर')} {formatPrice(restaurant.minOrder)}
          </span>
        </div>

        {restaurant.description && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
            {restaurant.description}
          </p>
        )}
      </div>

      {/* Search menu */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-gray)',
          borderRadius: 8,
          padding: '8px 12px'
        }}>
          <Search size={16} color="var(--text-light)" />
          <input
            type="text"
            placeholder={t('Search in menu...', 'मेनू में खोजें...')}
            value={searchMenu}
            onChange={e => setSearchMenu(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 14,
              padding: 0,
              flex: 1
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: activeCategory === cat ? 'var(--text)' : 'var(--bg-gray)',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat === 'all' ? t('All', 'सभी') : cat}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div style={{ padding: '0 16px', paddingBottom: showCartBar ? 80 : 20 }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
          ))
        ) : (
          <div className="empty-state" style={{ padding: 40 }}>
            <p>{t('No items found', 'कोई आइटम नहीं मिला')}</p>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {showCartBar && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 480,
            padding: '12px 16px',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 50
          }}
          onClick={() => navigate('/cart')}
        >
          <div>
            <span style={{ fontWeight: 700 }}>
              {cartCount} {t('item', 'आइटम')}{cartCount > 1 ? 's' : ''} | {formatPrice(cartTotal)}
            </span>
            <p style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>
              {t('Extra charges may apply', 'अतिरिक्त शुल्क लग सकता है')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            {t('View Cart', 'कार्ट देखें')} <ShoppingBag size={18} />
          </div>
        </div>
      )}
    </div>
  );
}
