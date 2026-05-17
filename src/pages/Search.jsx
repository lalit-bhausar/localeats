import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import RestaurantCard from '../components/RestaurantCard';
import { formatPrice } from '../utils/helpers';
import BottomNav from '../components/BottomNav';

export default function Search() {
  const navigate = useNavigate();
  const { restaurants, menuItems, t } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.toLowerCase().trim();

  // Search restaurants
  const matchedRestaurants = q ? restaurants.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.cuisine.some(c => c.toLowerCase().includes(q))
  ) : [];

  // Search menu items across all restaurants
  const matchedItems = q ? Object.entries(menuItems).flatMap(([restId, items]) => {
    const restaurant = restaurants.find(r => r.id === restId);
    return items
      .filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .map(i => ({ ...i, restaurant }));
  }) : [];

  const popularSearches = ['Biryani', 'Pizza', 'Burger', 'Chole Bhature', 'Dosa', 'Chinese', 'Juice', 'Paneer'];

  return (
    <div className="app-container">
      {/* Search header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-gray)',
          borderRadius: 8,
          padding: '8px 12px'
        }}>
          <SearchIcon size={16} color="var(--text-light)" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('Search restaurants or dishes...', 'रेस्तरां या व्यंजन खोजें...')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'none', border: 'none', fontSize: 14, padding: 0, flex: 1 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', display: 'flex' }}>
              <X size={16} color="var(--text-light)" />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '16px', paddingBottom: 80 }}>
        {/* No query - show popular searches */}
        {!q && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              {t('Popular Searches', 'लोकप्रिय खोजें')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {popularSearches.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: '1px solid var(--border)',
                    background: 'white',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Results */}
        {q && (
          <>
            {/* Matched dishes */}
            {matchedItems.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                  {t('Dishes', 'व्यंजन')} ({matchedItems.length})
                </h3>
                {matchedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/restaurant/${item.restaurant?.id}`)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer'
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className={`veg-badge ${item.isVeg ? '' : 'nonveg'}`} style={{ width: 12, height: 12 }} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatPrice(item.price)} • {item.restaurant?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Matched restaurants */}
            {matchedRestaurants.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 20, marginBottom: 12 }}>
                  {t('Restaurants', 'रेस्तरां')} ({matchedRestaurants.length})
                </h3>
                {matchedRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </>
            )}

            {/* No results */}
            {matchedItems.length === 0 && matchedRestaurants.length === 0 && (
              <div className="empty-state">
                <SearchIcon size={50} color="var(--text-light)" />
                <h3>{t('No results found', 'कोई परिणाम नहीं मिला')}</h3>
                <p>{t(`No results for "${query}"`, `"${query}" के लिए कोई परिणाम नहीं`)}</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
