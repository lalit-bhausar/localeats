import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, CheckCircle2, Clock, ChefHat, Bike, Package } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice, getStatusColor, getStatusText, timeAgo } from '../utils/helpers';

const statusSteps = [
  { key: 'pending', icon: Clock, label: 'Order Placed', labelHi: 'ऑर्डर हो गया' },
  { key: 'confirmed', icon: CheckCircle2, label: 'Confirmed', labelHi: 'कन्फर्म हो गया' },
  { key: 'preparing', icon: ChefHat, label: 'Preparing', labelHi: 'बन रहा है' },
  { key: 'out_for_delivery', icon: Bike, label: 'On the Way', labelHi: 'रास्ते में' },
  { key: 'delivered', icon: Package, label: 'Delivered', labelHi: 'डिलीवर हो गया' }
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, t, lang } = useApp();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="app-container empty-state">
        <h3>{t('Order not found', 'ऑर्डर नहीं मिला')}</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          {t('Go Home', 'होम पर जाएँ')}
        </button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border-light)'
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Order Tracking', 'ऑर्डर ट्रैकिंग')}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>#{order.id}</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Status banner */}
        <div style={{
          background: isDelivered ? '#F0FFF4' : isCancelled ? '#FFF5F5' : 'var(--primary-light)',
          borderRadius: 14,
          padding: '18px',
          marginBottom: 24,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>
            {isDelivered ? '✅' : isCancelled ? '❌' : order.status === 'preparing' ? '👨‍🍳' : order.status === 'out_for_delivery' ? '🛵' : '📋'}
          </div>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: isDelivered ? 'var(--success)' : isCancelled ? 'var(--danger)' : 'var(--primary)'
          }}>
            {getStatusText(order.status, lang)}
          </h3>
          {!isDelivered && !isCancelled && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {t('Estimated delivery: ', 'अनुमानित डिलीवरी: ')}{order.estimatedDelivery}
            </p>
          )}
        </div>

        {/* Status timeline */}
        {!isCancelled && (
          <div style={{ marginBottom: 24 }}>
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} style={{ display: 'flex', gap: 14 }}>
                  {/* Timeline line + circle */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 32
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--primary)' : 'var(--bg-gray)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isCurrent ? '3px solid var(--primary)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <Icon size={16} color={isCompleted ? 'white' : 'var(--text-light)'} />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div style={{
                        width: 2,
                        height: 30,
                        background: index < currentStepIndex ? 'var(--primary)' : 'var(--border)',
                        transition: 'background 0.3s'
                      }} />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ paddingTop: 5, paddingBottom: 14 }}>
                    <p style={{
                      fontSize: 14,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCompleted ? 'var(--text)' : 'var(--text-light)'
                    }}>
                      {lang === 'en' ? step.label : step.labelHi}
                    </p>
                    {isCurrent && (
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {timeAgo(order.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rider info */}
        {order.riderName && (
          <div style={{
            background: 'var(--bg-gray)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 18
              }}>
                {order.riderName[0]}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{order.riderName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t('Your delivery partner', 'आपका डिलीवरी पार्टनर')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--success)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={16} />
              </button>
              <button style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--info)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Order details */}
        <div style={{
          background: 'var(--bg-gray)',
          borderRadius: 12,
          padding: 16
        }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            {t('Order Details', 'ऑर्डर विवरण')}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 8 }}>
            {order.restaurantName}
          </p>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 3
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700,
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px dashed var(--border)',
            fontSize: 14
          }}>
            <span>{t('Total', 'कुल')}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--text-secondary)',
            marginTop: 8
          }}>
            <span>{t('Payment', 'भुगतान')}: {order.paymentMethod === 'cod'
              ? t('Cash on Delivery', 'कैश ऑन डिलीवरी')
              : 'UPI'}</span>
            <span>{t('Address', 'पता')}: {order.deliveryAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
