import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, Phone, MapPin, Package, CheckCircle, Bike, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice, getStatusColor, getStatusText, timeAgo } from '../utils/helpers';

export default function RiderApp() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, riders, assignRider } = useApp();
  const [selectedRider, setSelectedRider] = useState(riders[0]?.id || '');
  const [isOnline, setIsOnline] = useState(true);

  const rider = riders.find(r => r.id === selectedRider);
  const myOrders = orders.filter(o => o.riderId === selectedRider);
  const availableOrders = orders.filter(o =>
    !o.riderId && ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
  );
  const activeOrder = myOrders.find(o => !['delivered', 'cancelled'].includes(o.status));
  const completedDeliveries = myOrders.filter(o => o.status === 'delivered');

  const handleAcceptOrder = (orderId) => {
    if (rider) {
      assignRider(orderId, rider);
      toast.success('Order accepted! Navigate to restaurant 🛵');
    }
  };

  const handlePickup = (orderId) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    toast.success('Picked up! Delivering to customer 🏠');
  };

  const handleDeliver = (orderId) => {
    updateOrderStatus(orderId, 'delivered');
    toast.success('Delivered! Great job! ✅');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        background: isOnline ? 'var(--success)' : 'var(--text-secondary)',
        padding: '16px',
        color: 'white',
        transition: 'background 0.3s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', color: 'white', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Rider App</h2>
          <button
            onClick={() => { setIsOnline(!isOnline); toast.success(isOnline ? 'You are offline' : 'You are online!'); }}
            style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 12px', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {isOnline ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>

        {/* Select rider (demo) */}
        <select
          value={selectedRider}
          onChange={e => setSelectedRider(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '8px 10px', fontSize: 13, fontWeight: 600 }}
        >
          {riders.map(r => (
            <option key={r.id} value={r.id} style={{ color: 'black' }}>{r.name} - ⭐{r.rating} ({r.totalDeliveries} deliveries)</option>
          ))}
        </select>
      </div>

      <div style={{ padding: '16px', paddingBottom: 20 }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, background: 'var(--primary-light)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
              {rider?.totalDeliveries || 0}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Deliveries</p>
          </div>
          <div style={{ flex: 1, background: '#F0FFF4', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>
              {completedDeliveries.length}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Today</p>
          </div>
          <div style={{ flex: 1, background: '#FFFBEB', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--warning)' }}>
              ⭐ {rider?.rating || 0}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Rating</p>
          </div>
        </div>

        {/* Active delivery */}
        {activeOrder && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'var(--primary)' }}>
              🛵 Current Delivery
            </h3>
            <div className="card" style={{
              padding: 16,
              marginBottom: 16,
              border: '2px solid var(--primary)',
              borderRadius: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>#{activeOrder.id}</h4>
                  <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{activeOrder.restaurantName}</p>
                </div>
                <span className="status-badge" style={{
                  background: getStatusColor(activeOrder.status) + '20',
                  color: getStatusColor(activeOrder.status)
                }}>
                  {getStatusText(activeOrder.status)}
                </span>
              </div>

              <div style={{ background: 'var(--bg-gray)', borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 10 }}>
                <p><strong>Customer:</strong> {activeOrder.userName}</p>
                <p><strong>📞</strong> {activeOrder.userPhone}</p>
                <p><strong>📍</strong> {activeOrder.deliveryAddress}</p>
                <p><strong>💰</strong> {formatPrice(activeOrder.total)} ({activeOrder.paymentMethod === 'cod' ? 'Collect Cash' : 'Paid Online'})</p>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                Items: {activeOrder.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                {activeOrder.status === 'confirmed' || activeOrder.status === 'preparing' ? (
                  <>
                    <a
                      href={`https://maps.google.com/maps?q=restaurant+near+me`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Navigation size={14} /> Navigate to Restaurant
                    </a>
                    <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handlePickup(activeOrder.id)}>
                      <Package size={14} /> Picked Up
                    </button>
                  </>
                ) : activeOrder.status === 'out_for_delivery' ? (
                  <>
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(activeOrder.deliveryAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Navigation size={14} /> Navigate to Customer
                    </a>
                    <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleDeliver(activeOrder.id)}>
                      <CheckCircle size={14} /> Delivered
                    </button>
                  </>
                ) : null}
              </div>

              {/* Call customer */}
              <a
                href={`tel:${activeOrder.userPhone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 8,
                  padding: '8px',
                  background: 'var(--bg-gray)',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)'
                }}
              >
                <Phone size={14} /> Call Customer
              </a>
            </div>
          </>
        )}

        {/* Available orders to pick up */}
        {isOnline && !activeOrder && availableOrders.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
              📋 Available Orders ({availableOrders.length})
            </h3>
            {availableOrders.map(order => (
              <div key={order.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>{order.restaurantName}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {order.items.length} items • {formatPrice(order.total)}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{timeAgo(order.createdAt)}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  📍 {order.deliveryAddress}
                </p>
                <button
                  className="btn btn-primary btn-sm btn-full"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  <Bike size={14} /> Accept Delivery
                </button>
              </div>
            ))}
          </>
        )}

        {isOnline && !activeOrder && availableOrders.length === 0 && (
          <div className="empty-state">
            <Bike size={50} color="var(--text-light)" />
            <h3>No orders available</h3>
            <p>New delivery requests will appear here</p>
          </div>
        )}

        {!isOnline && (
          <div className="empty-state">
            <h3>You are offline</h3>
            <p>Go online to start receiving delivery requests</p>
          </div>
        )}

        {/* Completed deliveries */}
        {completedDeliveries.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>
              ✅ Completed Today
            </h3>
            {completedDeliveries.map(order => (
              <div key={order.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid var(--border-light)',
                fontSize: 13
              }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{order.restaurantName}</span>
                  <span style={{ color: 'var(--text-light)', marginLeft: 8 }}>{timeAgo(order.createdAt)}</span>
                </div>
                <span style={{ fontWeight: 700 }}>{formatPrice(order.total)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
