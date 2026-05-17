import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { formatPrice, getStatusColor, getStatusText, timeAgo, generateWhatsAppLink } from '../utils/helpers';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, assignRider, riders, restaurants } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="admin-container" style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/admin')} style={{ background: 'none', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>Manage Orders</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {['all', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: filterStatus === s ? 'var(--text)' : 'white',
              color: filterStatus === s ? 'white' : 'var(--text)',
              border: `1px solid ${filterStatus === s ? 'var(--text)' : 'var(--border)'}`,
              cursor: 'pointer'
            }}
          >
            {s === 'all' ? `All (${orders.length})` : `${getStatusText(s)} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No orders found</h3>
        </div>
      ) : filtered.map(order => {
        const restaurant = restaurants.find(r => r.id === order.restaurantId);
        return (
          <div key={order.id} className="card fade-in" style={{ padding: 18, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>#{order.id}</h4>
                  <span className="status-badge" style={{
                    background: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status)
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {order.restaurantName} • {timeAgo(order.createdAt)}
                </p>
              </div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{formatPrice(order.total)}</p>
            </div>

            {/* Customer info */}
            <div style={{
              background: 'var(--bg-gray)',
              borderRadius: 8,
              padding: 10,
              fontSize: 12,
              marginBottom: 10
            }}>
              <p><strong>Customer:</strong> {order.userName} ({order.userPhone})</p>
              <p><strong>Address:</strong> {order.deliveryAddress}</p>
              <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</p>
              <p><strong>Items:</strong> {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Update status */}
              <select
                value={order.status}
                onChange={e => {
                  updateOrderStatus(order.id, e.target.value);
                  toast.success(`Order updated to: ${getStatusText(e.target.value)}`);
                }}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  borderRadius: 6,
                  width: 'auto',
                  border: '1px solid var(--border)',
                  fontWeight: 600
                }}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{getStatusText(s)}</option>
                ))}
              </select>

              {/* Assign rider */}
              {!order.riderId && order.status !== 'cancelled' && order.status !== 'delivered' && (
                <select
                  defaultValue=""
                  onChange={e => {
                    const rider = riders.find(r => r.id === e.target.value);
                    if (rider) {
                      assignRider(order.id, rider);
                      toast.success(`Assigned to ${rider.name}`);
                    }
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: 12,
                    borderRadius: 6,
                    width: 'auto',
                    border: '1px solid var(--border)'
                  }}
                >
                  <option value="" disabled>Assign Rider</option>
                  {riders.filter(r => r.isAvailable).map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              )}

              {order.riderId && (
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  🛵 {order.riderName}
                </span>
              )}

              {/* WhatsApp button */}
              {restaurant?.phone && (
                <a
                  href={generateWhatsAppLink(restaurant.phone, order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{ background: '#25D366', color: 'white', fontSize: 11 }}
                >
                  📱 WhatsApp Restaurant
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
