import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartRestaurant, getCartTotal, placeOrder, user, deliveryAddress, setDeliveryAddress, t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');

  const subtotal = getCartTotal();
  const deliveryFee = cartRestaurant?.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!name.trim()) {
      toast.error(t('Please enter your name', 'कृपया अपना नाम दर्ज करें'));
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error(t('Please enter a valid phone number', 'कृपया सही फ़ोन नंबर दर्ज करें'));
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error(t('Please enter delivery address', 'कृपया डिलीवरी पता दर्ज करें'));
      return;
    }

    try {
      const order = await placeOrder(paymentMethod);
      const APP_URL = window.location.origin;

      // Send instant push notification to owner via ntfy.sh (FREE, no server needed)
      const items = order.items.map(i => `${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
      const confirmUrl = `${APP_URL}/order-action/${order.id}/confirmed`;

      try {
        await fetch('https://ntfy.sh/localeats-orders-8793', {
          method: 'POST',
          headers: {
            'Title': `🆕 New Order #${order.id} - ₹${order.total}`,
            'Priority': 'high',
            'Tags': 'fork_and_knife,moneybag',
            'Actions': [
              `view, ✅ Confirm Order, ${confirmUrl}`,
              `view, 👨‍🍳 Mark Preparing, ${APP_URL}/order-action/${order.id}/preparing`
            ].join('; '),
            'Click': confirmUrl
          },
          body: `🏪 ${order.restaurantName}\n` +
            `👤 ${name || user?.name} | 📞 ${phone || user?.phone}\n\n` +
            `🍽️ Items:\n${items}\n\n` +
            `💰 Total: ₹${order.total}\n` +
            `💳 ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}\n` +
            `📍 ${deliveryAddress}\n\n` +
            `✅ Confirm: ${confirmUrl}\n` +
            `👨‍🍳 Preparing: ${APP_URL}/order-action/${order.id}/preparing\n` +
            `🏍️ Out for Delivery: ${APP_URL}/order-action/${order.id}/out_for_delivery\n` +
            `📦 Delivered: ${APP_URL}/order-action/${order.id}/delivered`
        });
      } catch (e) {
        console.log('Notification send failed:', e);
      }

      toast.success(t('Order placed successfully! 🎉', 'ऑर्डर सफलतापूर्वक हो गया! 🎉'));
      navigate(`/order/${order.id}`);
    } catch (err) {
      toast.error(t('Failed to place order. Try again.', 'ऑर्डर नहीं हो पाया। फिर कोशिश करें।'));
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Checkout', 'चेकआउट')}</h2>
      </div>

      <div style={{ padding: '16px', paddingBottom: 100 }}>
        {/* Your Details */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            👤 {t('Your Details', 'आपका विवरण')}
          </h3>
          {user ? (
            <div style={{
              padding: 14, background: 'var(--bg-gray)', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 18
              }}>{user.name[0].toUpperCase()}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.phone}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                placeholder={t('Your Name', 'आपका नाम')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="tel"
                placeholder={t('Phone Number (10 digits)', 'फ़ोन नंबर (10 अंक)')}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={18} /> {t('Delivery Address', 'डिलीवरी पता')}
          </h3>
          <textarea
            placeholder={t(
              'Enter full address (House no, Street, Landmark)',
              'पूरा पता दर्ज करें (मकान नं, गली, लैंडमार्क)'
            )}
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CreditCard size={18} /> {t('Payment Method', 'भुगतान का तरीका')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* COD */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px',
              borderRadius: 10,
              border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border)'}`,
              background: paymentMethod === 'cod' ? 'var(--primary-light)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <Banknote size={22} color="var(--success)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{t('Cash on Delivery', 'कैश ऑन डिलीवरी')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t('Pay when your food arrives', 'खाना आने पर भुगतान करें')}
                </p>
              </div>
            </label>

            {/* UPI */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px',
              borderRadius: 10,
              border: `2px solid ${paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border)'}`,
              background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <Smartphone size={22} color="var(--info)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{t('UPI Payment', 'UPI भुगतान')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t('Pay via Google Pay, PhonePe, Paytm', 'Google Pay, PhonePe, Paytm से भुगतान करें')}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Order summary */}
        <div style={{
          background: 'var(--bg-gray)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            {t('Order Summary', 'ऑर्डर सारांश')}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {cartRestaurant?.name}
          </p>
          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 4
            }}>
              <span>{item.name} × {item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700,
            fontSize: 15,
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px dashed var(--border)'
          }}>
            <span>{t('Total', 'कुल')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Place Order button - fixed bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        padding: '12px 16px',
        background: 'white',
        borderTop: '1px solid var(--border-light)',
        zIndex: 50
      }}>
        <button
          className="btn btn-primary btn-full"
          style={{ padding: 14, fontSize: 15, borderRadius: 12 }}
          onClick={handlePlaceOrder}
        >
          {t('Place Order', 'ऑर्डर करें')} • {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
