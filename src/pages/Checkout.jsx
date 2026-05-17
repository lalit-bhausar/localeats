import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice, generateWhatsAppLink } from '../utils/helpers';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartRestaurant, getCartTotal, placeOrder, deliveryAddress, setDeliveryAddress, t, restaurants } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = cartRestaurant?.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
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

    const order = placeOrder(paymentMethod);

    // Open WhatsApp to notify restaurant
    const restaurant = restaurants.find(r => r.id === order.restaurantId);
    if (restaurant?.phone) {
      const whatsappUrl = generateWhatsAppLink(restaurant.phone, {
        ...order,
        userName: name,
        userPhone: phone
      });
      window.open(whatsappUrl, '_blank');
    }

    toast.success(t('Order placed successfully! 🎉', 'ऑर्डर सफलतापूर्वक हो गया! 🎉'));
    navigate(`/order/${order.id}`);
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
