import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, XCircle, Clock, ChefHat, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice, getStatusColor, getStatusText, timeAgo } from '../utils/helpers';

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, restaurants } = useApp();
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]?.id || '');

  const restaurantOrders = orders.filter(o => o.restaurantId === selectedRestaurant);
  const restaurant = restaurants.find(r => r.id === selectedRestaurant);

  const newOrders = restaurantOrders.filter(o => o.status === 'pending');
  const activeOrders = restaurantOrders.filter(o => ['confirmed', 'preparing'].includes(o.status));
  const completedOrders = restaurantOrders.filter(o => ['out_for_delivery', 'delivered'].includes(o.status));

  const handleAccept = (orderId) => {
    updateOrderStatus(orderId, 'confirmed');
    toast.success('Order accepted! ✅');
  };

  const handleReject = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
    toast.error('Order rejected');
  };

  const handleReady = (orderId) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    toast.success('Marked as ready for pickup! 🛵');
  };

  const OrderCard = ({ order, showActions }) => (
    <div className="card fade-in" style={{ padding: 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700 }}>#{order.id}</h4>
            <span className="status-badge" style={{
              background: getStatusColor(order.status) + '20',
              color: getStatusColor(order.status),
              fontSize: 11
            }}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {order.userName} • {timeAgo(order.createdAt)}
          </p>
        </div>
        <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>{formatPrice(order.total)}</p>
      </div>

      {/* Items */}
      <div style={{
        background: 'var(--bg-gray)',
        borderRadius: 8,
        padding: 10,
        fontSize: 13,
        marginBottom: 10
      }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span>{item.name} × {item.qty}</span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-light)' }}>
        📍 {order.deliveryAddress} | 💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}
      </p>

      {/* Actions */}
      {showActions === 'new' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleAccept(order.id)}>
            <CheckCircle size={14} /> Accept
          </button>
          <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => handleReject(order.id)}>
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}
      {showActions === 'active' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {order.status === 'confirmed' && (
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
              onClick={() => { updateOrderStatus(order.id, 'preparing'); toast.success('Cooking started! 👨‍🍳'); }}>
              <ChefHat size={14} /> Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleReady(order.id)}>
              <Package size={14} /> Ready for Pickup
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-container" style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>Restaurant Dashboard</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage your orders</p>
          </div>
        </div>
        {newOrders.length > 0 && (
          <div style={{
            background: 'var(--danger)',
            color: 'white',
            borderRadius: 20,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            animation: 'pulse 1.5s infinite'
          }}>
            <Bell size={14} /> {newOrders.length} New
          </div>
        )}
      </div>

      {/* Select restaurant */}
      <select
        value={selectedRestaurant}
        onChange={e => setSelectedRestaurant(e.target.value)}
        style={{ marginBottom: 16, fontWeight: 600 }}
      >
        {restaurants.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'New', count: newOrders.length, color: '#EF4444', bg: '#FFF5F5' },
          { label: 'Active', count: activeOrders.length, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Completed', count: completedOrders.length, color: '#22C55E', bg: '#F0FFF4' }
        ].map(s => (
          <div key={s.label} style={{
            flex: 1,
            background: s.bg,
            borderRadius: 10,
            padding: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* New Orders */}
      {newOrders.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'var(--danger)' }}>
            🔔 New Orders ({newOrders.length})
          </h3>
          {newOrders.map(o => <OrderCard key={o.id} order={o} showActions="new" />)}
        </>
      )}

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, marginTop: 20, color: 'var(--warning)' }}>
            👨‍🍳 Active Orders ({activeOrders.length})
          </h3>
          {activeOrders.map(o => <OrderCard key={o.id} order={o} showActions="active" />)}
        </>
      )}

      {/* Completed */}
      {completedOrders.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, marginTop: 20, color: 'var(--success)' }}>
            ✅ Completed ({completedOrders.length})
          </h3>
          {completedOrders.map(o => <OrderCard key={o.id} order={o} showActions={false} />)}
        </>
      )}

      {restaurantOrders.length === 0 && (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>New orders will appear here in real-time</p>
        </div>
      )}
    </div>
  );
}
