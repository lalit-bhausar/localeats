import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';
import BottomNav from '../components/BottomNav';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, cartRestaurant, addToCart, removeFromCart, clearCart, getCartTotal, t, user } = useApp();

  const subtotal = getCartTotal();
  const deliveryFee = cartRestaurant?.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className="app-container">
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Your Cart', 'आपका कार्ट')}</h2>
        </div>
        <div className="empty-state">
          <ShoppingBag size={60} color="var(--text-light)" />
          <h3>{t('Your cart is empty', 'आपका कार्ट खाली है')}</h3>
          <p>{t('Add items from a restaurant to get started', 'शुरू करने के लिए रेस्तरां से आइटम जोड़ें')}</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/')}
          >
            {t('Browse Restaurants', 'रेस्तरां देखें')}
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Your Cart', 'आपका कार्ट')}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {t('from', 'से')} {cartRestaurant?.name}
            </p>
          </div>
        </div>
        <button
          onClick={clearCart}
          style={{
            background: 'none',
            color: 'var(--danger)',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Trash2 size={14} /> {t('Clear', 'हटाएँ')}
        </button>
      </div>

      {/* Cart items */}
      <div style={{ padding: '0 16px' }}>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className={`veg-badge ${item.isVeg ? '' : 'nonveg'}`} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {formatPrice(item.price)}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Qty controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--primary)',
                borderRadius: 8,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', color: 'var(--primary)', padding: '4px 8px', display: 'flex' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{
                  minWidth: 24,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--primary)'
                }}>
                  {item.qty}
                </span>
                <button
                  onClick={() => addToCart(item, cartRestaurant)}
                  style={{ background: 'none', color: 'var(--primary)', padding: '4px 8px', display: 'flex' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <span style={{ fontWeight: 700, fontSize: 14, minWidth: 50, textAlign: 'right' }}>
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bill details */}
      <div style={{ padding: '20px 16px', borderTop: '6px solid var(--bg-gray)', marginTop: 8 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          {t('Bill Details', 'बिल विवरण')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('Item Total', 'आइटम कुल')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('Delivery Fee', 'डिलीवरी शुल्क')}</span>
            <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : t('FREE', 'फ्री')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('Taxes (5%)', 'टैक्स (5%)')}</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700,
            fontSize: 16,
            paddingTop: 10,
            borderTop: '1px dashed var(--border)'
          }}>
            <span>{t('Total', 'कुल')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div style={{ padding: '12px 16px 90px' }}>
        {user ? (
          <button
            className="btn btn-primary btn-full"
            style={{ padding: 14, fontSize: 15, borderRadius: 12 }}
            onClick={() => navigate('/checkout')}
          >
            {t('Proceed to Checkout', 'चेकआउट पर जाएँ')} • {formatPrice(total)}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-full"
            style={{ padding: 14, fontSize: 15, borderRadius: 12 }}
            onClick={() => navigate('/login', { state: { from: '/checkout' } })}
          >
            {t('Login to Place Order', 'ऑर्डर करने के लिए लॉगिन करें')} • {formatPrice(total)}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
