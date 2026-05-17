import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice, getStatusColor, getStatusText, timeAgo } from '../utils/helpers';
import BottomNav from '../components/BottomNav';

export default function MyOrders() {
  const navigate = useNavigate();
  const { orders, user, t, lang } = useApp();

  // Show this customer's orders - match by userId OR phone number
  const myOrders = user ? orders.filter(o =>
    o.userId === user.id || o.userPhone === user.phone
  ) : [];

  return (
    <div className="app-container">
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('My Orders', 'मेरे ऑर्डर')}</h2>
      </div>

      {myOrders.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={60} color="var(--text-light)" />
          <h3>{t('No orders yet', 'अभी तक कोई ऑर्डर नहीं')}</h3>
          <p>{t('Your orders will appear here', 'आपके ऑर्डर यहाँ दिखेंगे')}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            {t('Order Now', 'अभी ऑर्डर करें')}
          </button>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', paddingBottom: 80 }}>
          {myOrders.map(order => (
            <div
              key={order.id}
              className="card fade-in"
              onClick={() => navigate(`/order/${order.id}`)}
              style={{
                padding: 16,
                marginBottom: 12,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{order.restaurantName}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                  </p>
                </div>
                <ChevronRight size={18} color="var(--text-light)" />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px solid var(--border-light)'
              }}>
                <span
                  className="status-badge"
                  style={{
                    background: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status)
                  }}
                >
                  {getStatusText(order.status, lang)}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(order.total)}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{timeAgo(order.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
