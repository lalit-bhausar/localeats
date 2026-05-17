import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

const UPI_ID = 'lalitbhausar-2@okicici';
const MERCHANT_NAME = 'LocalEats';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartRestaurant, getCartTotal, placeOrder, user, deliveryAddress, setDeliveryAddress, t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [upiStep, setUpiStep] = useState('select'); // 'select' | 'paying' | 'done'

  const subtotal = getCartTotal();
  const deliveryFee = cartRestaurant?.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error(t('Please enter your name', 'कृपया अपना नाम दर्ज करें'));
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error(t('Please enter a valid phone number', 'कृपया सही फ़ोन नंबर दर्ज करें'));
      return false;
    }
    if (!deliveryAddress.trim()) {
      toast.error(t('Please enter delivery address', 'कृपया डिलीवरी पता दर्ज करें'));
      return false;
    }
    return true;
  };

  const openUpiApp = () => {
    if (!validateForm()) return;

    // Create UPI deep link
    const upiUrl = 'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
      '&pn=' + encodeURIComponent(MERCHANT_NAME) +
      '&am=' + total +
      '&cu=INR' +
      '&tn=' + encodeURIComponent('Order from ' + (cartRestaurant?.name || 'LocalEats'));

    // Open UPI app
    window.location.href = upiUrl;
    setUpiStep('paying');
  };

  const completeOrder = async (paidViaUpi) => {
    try {
      const order = await placeOrder(paidViaUpi ? 'upi' : 'cod');
      const APP_URL = window.location.origin;

      // Send instant push notification to owner via ntfy.sh
      const items = order.items.map(i => i.name + ' x' + i.qty + ' = Rs.' + (i.price * i.qty)).join('\n');
      const confirmUrl = APP_URL + '/order-action/' + order.id + '/confirmed';

      try {
        const msgBody = 'Restaurant: ' + order.restaurantName + '\n' +
          'Customer: ' + (name || user?.name || 'Guest') + ' | Phone: ' + (phone || user?.phone || 'N/A') + '\n\n' +
          'Items:\n' + items + '\n\n' +
          'Total: Rs.' + order.total + '\n' +
          'Payment: ' + (paidViaUpi ? 'UPI (Paid)' : 'Cash on Delivery') + '\n' +
          'Address: ' + deliveryAddress + '\n\n' +
          'Confirm: ' + confirmUrl + '\n' +
          'Preparing: ' + APP_URL + '/order-action/' + order.id + '/preparing\n' +
          'Out for Delivery: ' + APP_URL + '/order-action/' + order.id + '/out_for_delivery\n' +
          'Delivered: ' + APP_URL + '/order-action/' + order.id + '/delivered';

        fetch('https://ntfy.sh/localeats-orders-8793', {
          method: 'POST',
          body: JSON.stringify({
            topic: 'localeats-orders-8793',
            title: 'New Order ' + order.id + (paidViaUpi ? ' (UPI Paid)' : ' (COD)'),
            message: msgBody,
            priority: 4
          })
        }).then(r => console.log('ntfy status:', r.status))
          .catch(e => console.error('ntfy error:', e));
      } catch (e) {
        console.error('ntfy setup error:', e);
      }

      toast.success(t('Order placed successfully!', 'ऑर्डर सफलतापूर्वक हो गया!'));
      navigate('/order/' + order.id);
    } catch (err) {
      toast.error(t('Failed to place order. Try again.', 'ऑर्डर नहीं हो पाया। फिर कोशिश करें।'));
    }
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    if (paymentMethod === 'upi') {
      openUpiApp();
    } else {
      completeOrder(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)' }}>
        <button onClick={() => { setUpiStep('select'); navigate(-1); }} style={{ background: 'none', display: 'flex' }}>
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
              border: '2px solid ' + (paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border)'),
              background: paymentMethod === 'cod' ? 'var(--primary-light)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cod'}
                onChange={() => { setPaymentMethod('cod'); setUpiStep('select'); }}
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
              border: '2px solid ' + (paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border)'),
              background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'upi'}
                onChange={() => { setPaymentMethod('upi'); setUpiStep('select'); }}
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

        {/* UPI Payment Status - shown after user opens UPI app */}
        {paymentMethod === 'upi' && upiStep === 'paying' && (
          <div style={{
            background: '#FFF8E1',
            border: '2px solid #FFC107',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              {t('Complete payment in your UPI app', 'अपने UPI ऐप में भुगतान पूरा करें')}
            </h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
              {t('Pay', 'भुगतान करें')} {formatPrice(total)} {t('to', 'को')} {UPI_ID}
            </p>
            <p style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
              {t('After payment, tap the button below', 'भुगतान के बाद, नीचे बटन दबाएं')}
            </p>
            <button
              onClick={() => completeOrder(true)}
              style={{
                width: '100%',
                padding: 14,
                background: '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <CheckCircle size={20} />
              {t("I've Completed Payment", 'मैंने भुगतान कर दिया')}
            </button>
            <button
              onClick={() => setUpiStep('select')}
              style={{
                width: '100%',
                padding: 10,
                background: 'none',
                color: '#666',
                border: 'none',
                fontSize: 13,
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              {t('Cancel & choose different method', 'रद्द करें और दूसरा तरीका चुनें')}
            </button>
          </div>
        )}

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

      {/* Place Order button - fixed bottom (hidden during UPI payment step) */}
      {upiStep !== 'paying' && (
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
            {paymentMethod === 'upi'
              ? t('Pay & Place Order', 'भुगतान करें और ऑर्डर करें')
              : t('Place Order', 'ऑर्डर करें')
            } • {formatPrice(total)}
          </button>
        </div>
      )}
    </div>
  );
}
