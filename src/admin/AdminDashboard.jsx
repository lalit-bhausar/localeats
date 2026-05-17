import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Users, TrendingUp, ArrowLeft, ChevronRight, IndianRupee } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { restaurants, orders, riders } = useApp();

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: IndianRupee, color: '#22C55E', bg: '#F0FFF4' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Restaurants', value: restaurants.length, icon: Store, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Active Orders', value: activeOrders.length, icon: TrendingUp, color: '#8B5CF6', bg: '#F5F3FF' }
  ];

  const menuItems = [
    { label: 'Manage Restaurants', desc: 'Add, edit, toggle restaurants', path: '/admin/restaurants', icon: Store },
    { label: 'Manage Orders', desc: 'View and update order statuses', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Riders', desc: `${riders.length} delivery partners`, path: null, icon: Users }
  ];

  return (
    <div className="admin-container" style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>LocalEats Management</p>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 24
      }}>
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card" style={{ padding: 18 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}>
                <Icon size={20} color={stat.color} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Today's Orders ({todayOrders.length})</h3>
          <button
            onClick={() => navigate('/admin/orders')}
            style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, background: 'none' }}
          >
            View All →
          </button>
        </div>
        {todayOrders.length > 0 ? todayOrders.slice(0, 5).map(order => (
          <div key={order.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13 }}>#{order.id}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {order.restaurantName} • {order.items.length} items
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: 13 }}>{formatPrice(order.total)}</p>
              <span className="status-badge" style={{
                background: order.status === 'delivered' ? '#F0FFF4' : '#FFF7ED',
                color: order.status === 'delivered' ? 'var(--success)' : 'var(--primary)',
                fontSize: 11
              }}>
                {order.status}
              </span>
            </div>
          </div>
        )) : (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>
            No orders today yet
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              onClick={() => item.path && navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                cursor: item.path ? 'pointer' : 'default',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { if (item.path) e.currentTarget.style.background = 'var(--bg-gray)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              {item.path && <ChevronRight size={18} color="var(--text-light)" />}
            </div>
          );
        })}
      </div>

      {/* Back to app */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to Customer App
        </button>
      </div>
    </div>
  );
}
