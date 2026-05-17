import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';

const statusLabels = {
  confirmed: { en: 'Confirmed', hi: 'कन्फर्म हो गया', emoji: '✅', next: 'preparing' },
  preparing: { en: 'Preparing', hi: 'बन रहा है', emoji: '👨‍🍳', next: 'out_for_delivery' },
  out_for_delivery: { en: 'Out for Delivery', hi: 'डिलीवरी के लिए निकला', emoji: '🏍️', next: 'delivered' },
  delivered: { en: 'Delivered', hi: 'डिलीवर हो गया', emoji: '📦', next: null }
};

const APP_URL = window.location.origin;

export default function OrderAction() {
  const { orderId, status } = useParams();
  const navigate = useNavigate();
  const { updateOrderStatus, orders, t } = useApp();
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Find the order
    const found = orders.find(o => o.id === orderId);
    setOrder(found);

    // Update the status
    if (orderId && status && statusLabels[status]) {
      updateOrderStatus(orderId, status);
      setDone(true);
    }
  }, [orderId, status]);

  const info = statusLabels[status] || {};
  const nextStatus = info.next;
  const nextInfo = nextStatus ? statusLabels[nextStatus] : null;

  // Generate WhatsApp link for next status update
  const getNextWhatsAppLink = () => {
    if (!nextInfo || !orderId) return null;
    const OWNER_PHONE = '8793381280';
    const nextUrl = `${APP_URL}/order-action/${orderId}/${nextStatus}`;
    const msg = encodeURIComponent(
      `Update Order #${orderId} to *${nextInfo.en}* ${nextInfo.emoji}\n\n` +
      `👉 Click to update: ${nextUrl}`
    );
    return `https://wa.me/91${OWNER_PHONE}?text=${msg}`;
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f5f5', padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 32,
        maxWidth: 400, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {done ? (
          <>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{info.emoji}</div>
            <h2 style={{ color: '#1a1a2e', marginBottom: 8 }}>Order Updated!</h2>
            <p style={{ color: '#666', marginBottom: 4 }}>
              Order <strong>#{orderId}</strong>
            </p>
            <p style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: 20,
              background: '#22C55E20', color: '#22C55E', fontWeight: 700,
              fontSize: 16, marginBottom: 20
            }}>
              {info.emoji} {info.en}
            </p>

            {order && (
              <div style={{
                background: '#f9f9f9', borderRadius: 10, padding: 14,
                marginBottom: 20, textAlign: 'left'
              }}>
                <p style={{ fontSize: 13, color: '#666' }}>
                  <strong>Customer:</strong> {order.userName} ({order.userPhone})
                </p>
                <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  <strong>Items:</strong> {order.items?.map(i => `${i.name} x${i.qty}`).join(', ')}
                </p>
                <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  <strong>Total:</strong> ₹{order.total}
                </p>
                <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
              </div>
            )}

            {nextInfo && (
              <a
                href={`${APP_URL}/order-action/${orderId}/${nextStatus}`}
                style={{
                  display: 'block', width: '100%', padding: 14,
                  background: '#FF6B00', color: 'white', border: 'none',
                  borderRadius: 10, fontSize: 15, fontWeight: 'bold',
                  textDecoration: 'none', marginBottom: 10
                }}
              >
                {nextInfo.emoji} Mark as {nextInfo.en}
              </a>
            )}

            <button
              onClick={() => navigate('/admin/orders')}
              style={{
                display: 'block', width: '100%', padding: 12,
                background: '#eee', color: '#333', border: 'none',
                borderRadius: 10, fontSize: 14, cursor: 'pointer',
                marginTop: 8
              }}
            >
              Open Admin Panel
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40 }}>⚠️</div>
            <h2>Invalid Action</h2>
            <p style={{ color: '#666' }}>This link is not valid.</p>
          </>
        )}
      </div>
    </div>
  );
}
