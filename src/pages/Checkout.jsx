import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

const UPI_ID = 'lalitbhausar-2@okicici';
const MERCHANT_NAME = 'LocalEats';

// Generate UPI QR code URL using a free QR API
function getQrCodeUrl(amount, orderId) {
  const upiString = 'upi://pay?pa=' + UPI_ID +
    '&pn=' + encodeURIComponent(MERCHANT_NAME) +
    '&am=' + amount +
    '&cu=INR' +
    '&tn=' + encodeURIComponent('Order ' + (orderId || 'LocalEats'));
  return 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(upiString);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartRestaurant, getCartTotal, placeOrder, user, deliveryAddress, setDeliveryAddress, t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [placing, setPlacing] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = cartRestaurant?.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  // Pre-generate QR code URL
  const qrUrl = useMemo(() => getQrCodeUrl(total, ''), [total]);

  // Require login
  if (!user) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

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

  const openUpiApp = (app) => {
    const upiUrl = 'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
      '&pn=' + encodeURIComponent(MERCHANT_NAME) +
      '&am=' + total +
      '&cu=INR' +
      '&tn=' + encodeURIComponent('Order from ' + (cartRestaurant?.name || 'LocalEats'));

    // Different deep links for different UPI apps
    let deepLink = upiUrl;
    if (app === 'gpay') {
      deepLink = 'tez://upi/pay?pa=' + encodeURIComponent(UPI_ID) +
        '&pn=' + encodeURIComponent(MERCHANT_NAME) +
        '&am=' + total + '&cu=INR' +
        '&tn=' + encodeURIComponent('Order from ' + (cartRestaurant?.name || 'LocalEats'));
    } else if (app === 'phonepe') {
      deepLink = 'phonepe://pay?pa=' + encodeURIComponent(UPI_ID) +
        '&pn=' + encodeURIComponent(MERCHANT_NAME) +
        '&am=' + total + '&cu=INR' +
        '&tn=' + encodeURIComponent('Order from ' + (cartRestaurant?.name || 'LocalEats'));
    } else if (app === 'paytm') {
      deepLink = 'paytmmp://pay?pa=' + encodeURIComponent(UPI_ID) +
        '&pn=' + encodeURIComponent(MERCHANT_NAME) +
        '&am=' + total + '&cu=INR' +
        '&tn=' + encodeURIComponent('Order from ' + (cartRestaurant?.name || 'LocalEats'));
    }

    window.location.href = deepLink;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    if (paymentMethod === 'upi') {
      setShowUpiModal(true);
    } else {
      completeOrder(false, '');
    }
  };

  const handleUpiConfirm = () => {
    if (!transactionId.trim()) {
      toast.error(t('Please enter UPI Transaction ID', 'कृपया UPI ट्रांजेक्शन ID दर्ज करें'));
      return;
    }
    if (transactionId.trim().length < 6) {
      toast.error(t('Please enter a valid Transaction ID', 'कृपया सही ट्रांजेक्शन ID दर्ज करें'));
      return;
    }
    completeOrder(true, transactionId.trim());
  };

  const completeOrder = async (paidViaUpi, txnId) => {
    if (placing) return;
    setPlacing(true);

    try {
      const order = await placeOrder(paidViaUpi ? 'upi' : 'cod');

      // Add transaction ID to the order if UPI
      if (paidViaUpi && txnId) {
        order.upiTransactionId = txnId;
        // Update the order in localStorage with txn ID
        try {
          const savedOrders = JSON.parse(localStorage.getItem('le_orders') || '[]');
          const idx = savedOrders.findIndex(o => o.id === order.id);
          if (idx >= 0) {
            savedOrders[idx].upiTransactionId = txnId;
          } else {
            savedOrders.unshift({ ...order, upiTransactionId: txnId });
          }
          localStorage.setItem('le_orders', JSON.stringify(savedOrders));
        } catch (e) {}
      }

      const APP_URL = window.location.origin;
      const items = order.items.map(i => i.name + ' x' + i.qty + ' = Rs.' + (i.price * i.qty)).join('\n');
      const confirmUrl = APP_URL + '/order-action/' + order.id + '/confirmed';

      try {
        const msgBody = 'Restaurant: ' + order.restaurantName + '\n' +
          'Customer: ' + (name || user?.name || 'Guest') + ' | Phone: ' + (phone || user?.phone || 'N/A') + '\n\n' +
          'Items:\n' + items + '\n\n' +
          'Total: Rs.' + order.total + '\n' +
          'Payment: ' + (paidViaUpi ? 'UPI PAID (Txn: ' + txnId + ')' : 'Cash on Delivery') + '\n' +
          'Address: ' + deliveryAddress + '\n\n' +
          'Confirm: ' + confirmUrl + '\n' +
          'Preparing: ' + APP_URL + '/order-action/' + order.id + '/preparing\n' +
          'Out for Delivery: ' + APP_URL + '/order-action/' + order.id + '/out_for_delivery\n' +
          'Delivered: ' + APP_URL + '/order-action/' + order.id + '/delivered';

        fetch('https://ntfy.sh/localeats-orders-8793', {
          method: 'POST',
          body: JSON.stringify({
            topic: 'localeats-orders-8793',
            title: 'New Order ' + order.id + (paidViaUpi ? ' - UPI PAID (Txn: ' + txnId + ')' : ' - COD'),
            message: msgBody,
            priority: 4
          })
        }).then(r => console.log('ntfy status:', r.status))
          .catch(e => console.error('ntfy error:', e));
      } catch (e) {}

      setShowUpiModal(false);
      toast.success(t('Order placed successfully!', 'ऑर्डर सफलतापूर्वक हो गया!'));
      navigate('/order/' + order.id);
    } catch (err) {
      toast.error(t('Failed to place order. Try again.', 'ऑर्डर नहीं हो पाया। फिर कोशिश करें।'));
    } finally {
      setPlacing(false);
    }
  };

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: '#4285F4', icon: '💙' },
    { id: 'phonepe', name: 'PhonePe', color: '#5F259F', icon: '💜' },
    { id: 'paytm', name: 'Paytm', color: '#00BAF2', icon: '💠' },
    { id: 'qr', name: 'Scan QR Code', color: '#333', icon: '📷' }
  ];

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
              <input type="text" placeholder={t('Your Name', 'आपका नाम')} value={name}
                onChange={e => setName(e.target.value)} />
              <input type="tel" placeholder={t('Phone Number (10 digits)', 'फ़ोन नंबर (10 अंक)')} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={18} /> {t('Delivery Address', 'डिलीवरी पता')}
          </h3>
          <textarea
            placeholder={t('Enter full address (House no, Street, Landmark)', 'पूरा पता दर्ज करें (मकान नं, गली, लैंडमार्क)')}
            value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
            rows={3} style={{ resize: 'vertical' }}
          />
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CreditCard size={18} /> {t('Payment Method', 'भुगतान का तरीका')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 10,
              border: '2px solid ' + (paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border)'),
              background: paymentMethod === 'cod' ? 'var(--primary-light)' : 'white', cursor: 'pointer'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
              <Banknote size={22} color="var(--success)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{t('Cash on Delivery', 'कैश ऑन डिलीवरी')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t('Pay when your food arrives', 'खाना आने पर भुगतान करें')}
                </p>
              </div>
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 10,
              border: '2px solid ' + (paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border)'),
              background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'white', cursor: 'pointer'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
              <Smartphone size={22} color="var(--info)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{t('UPI Payment', 'UPI भुगतान')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t('Google Pay, PhonePe, Paytm', 'Google Pay, PhonePe, Paytm')}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: 'var(--bg-gray)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            {t('Order Summary', 'ऑर्डर सारांश')}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{cartRestaurant?.name}</p>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>{item.name} × {item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15,
            marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)'
          }}>
            <span>{t('Total', 'कुल')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Place Order button */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '12px 16px',
        background: 'white', borderTop: '1px solid var(--border-light)', zIndex: 50
      }}>
        <button className="btn btn-primary btn-full"
          style={{ padding: 14, fontSize: 15, borderRadius: 12 }}
          onClick={handlePlaceOrder}>
          {paymentMethod === 'upi'
            ? t('Pay via UPI', 'UPI से भुगतान करें')
            : t('Place Order', 'ऑर्डर करें')
          } • {formatPrice(total)}
        </button>
      </div>

      {/* UPI Payment Modal */}
      {showUpiModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} onClick={() => setShowUpiModal(false)}>
          <div style={{
            background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px',
            width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                {t('Pay', 'भुगतान करें')} {formatPrice(total)}
              </h3>
              <button onClick={() => { setShowUpiModal(false); setSelectedUpiApp(null); setTransactionId(''); }}
                style={{ background: '#f0f0f0', borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Step 1: Choose UPI app */}
            {!selectedUpiApp && (
              <>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                  {t('Choose how to pay:', 'भुगतान का तरीका चुनें:')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {upiApps.map(app => (
                    <button key={app.id} onClick={() => {
                      setSelectedUpiApp(app.id);
                      if (app.id !== 'qr') openUpiApp(app.id);
                    }} style={{
                      padding: 16, borderRadius: 12, border: '2px solid #eee',
                      background: 'white', cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>{app.icon}</div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{app.name}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: QR Code or waiting for payment */}
            {selectedUpiApp && (
              <>
                {/* Show QR code */}
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {selectedUpiApp === 'qr' ? (
                    <>
                      <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
                        {t('Scan this QR code with any UPI app', 'किसी भी UPI ऐप से यह QR कोड स्कैन करें')}
                      </p>
                      <div style={{
                        display: 'inline-block', padding: 12, background: 'white',
                        border: '2px solid #eee', borderRadius: 12
                      }}>
                        <img src={qrUrl} alt="UPI QR Code" style={{ width: 220, height: 220, display: 'block' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>
                        {upiApps.find(a => a.id === selectedUpiApp)?.icon}
                      </div>
                      <p style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>
                        {t('Complete payment of', 'भुगतान पूरा करें')} <strong>{formatPrice(total)}</strong>
                        {t(' in your UPI app', ' अपने UPI ऐप में')}
                      </p>
                      <p style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
                        {t('Pay to: ', 'भुगतान करें: ')}<strong>{UPI_ID}</strong>
                      </p>

                      {/* Also show QR as fallback */}
                      <details style={{ marginTop: 8 }}>
                        <summary style={{ fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                          {t("App didn't open? Scan QR instead", 'ऐप नहीं खुला? QR स्कैन करें')}
                        </summary>
                        <div style={{ marginTop: 10, display: 'inline-block', padding: 10, background: 'white',
                          border: '2px solid #eee', borderRadius: 12 }}>
                          <img src={qrUrl} alt="UPI QR Code" style={{ width: 200, height: 200, display: 'block' }} />
                        </div>
                      </details>
                    </>
                  )}
                </div>

                {/* Amount display */}
                <div style={{
                  background: '#F0FFF4', borderRadius: 10, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 16
                }}>
                  <span style={{ fontSize: 13, color: '#666' }}>{t('Amount to pay', 'भुगतान राशि')}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#22C55E' }}>{formatPrice(total)}</span>
                </div>

                {/* Transaction ID input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    {t('Enter UPI Transaction ID / UTR Number *', 'UPI ट्रांजेक्शन ID / UTR नंबर दर्ज करें *')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('e.g. 412345678901', 'जैसे 412345678901')}
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    style={{
                      width: '100%', padding: '14px', fontSize: 16, borderRadius: 10,
                      border: '2px solid var(--border)', outline: 'none', letterSpacing: 1,
                      fontWeight: 600
                    }}
                  />
                  <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                    {t('You can find this in your UPI app payment history', 'यह आपके UPI ऐप की भुगतान हिस्ट्री में मिलेगा')}
                  </p>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleUpiConfirm}
                  disabled={placing || !transactionId.trim()}
                  style={{
                    width: '100%', padding: 15, fontSize: 16, fontWeight: 700,
                    background: transactionId.trim().length >= 6 ? 'var(--primary)' : '#ccc',
                    color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer',
                    marginBottom: 8
                  }}
                >
                  {placing
                    ? t('Placing Order...', 'ऑर्डर हो रहा है...')
                    : t('Confirm Payment & Place Order', 'भुगतान कन्फर्म करें और ऑर्डर करें')
                  }
                </button>

                {/* Back button */}
                <button onClick={() => { setSelectedUpiApp(null); setTransactionId(''); }}
                  style={{
                    width: '100%', padding: 10, background: 'none',
                    color: '#666', border: 'none', fontSize: 13, cursor: 'pointer'
                  }}>
                  {t('Choose different payment method', 'दूसरा भुगतान तरीका चुनें')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
