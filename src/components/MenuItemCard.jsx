import { Plus, Minus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

export default function MenuItemCard({ item, restaurant }) {
  const { cart, addToCart, removeFromCart, t } = useApp();
  const cartItem = cart.find(c => c.id === item.id);
  const qty = cartItem?.qty || 0;

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '14px 0',
      borderBottom: '1px solid var(--border-light)',
      opacity: item.isAvailable ? 1 : 0.5
    }}>
      {/* Left: Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div className={`veg-badge ${item.isVeg ? '' : 'nonveg'}`} />
          {item.isBestseller && (
            <span className="bestseller-tag">★ {t('Bestseller', 'बेस्टसेलर')}</span>
          )}
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
          {item.name}
        </h4>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
          {formatPrice(item.price)}
        </p>
        {item.description && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Right: Image + Add button */}
      <div style={{ width: 110, position: 'relative', flexShrink: 0 }}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: 110,
              height: 90,
              objectFit: 'cover',
              borderRadius: 10
            }}
            loading="lazy"
          />
        )}

        {/* Add/Qty button */}
        {item.isAvailable && (
          <div style={{
            position: item.image ? 'absolute' : 'relative',
            bottom: item.image ? -12 : 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            {qty === 0 ? (
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(item, restaurant); }}
                style={{
                  background: 'white',
                  color: 'var(--primary)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 8,
                  padding: '6px 24px',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: 'var(--shadow)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t('ADD', 'जोड़ें')}
              </button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                background: 'var(--primary)',
                borderRadius: 8,
                boxShadow: 'var(--shadow)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                  style={{
                    background: 'none',
                    color: 'white',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex'
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 24,
                  textAlign: 'center'
                }}>
                  {qty}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(item, restaurant); }}
                  style={{
                    background: 'none',
                    color: 'white',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {!item.isAvailable && (
          <p style={{
            fontSize: 11,
            color: 'var(--danger)',
            textAlign: 'center',
            marginTop: 4,
            fontWeight: 600
          }}>
            {t('Not Available', 'उपलब्ध नहीं')}
          </p>
        )}
      </div>
    </div>
  );
}
