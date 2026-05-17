import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, LogOut, Settings, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser, t, orders } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error(t('Please fill name and phone', 'कृपया नाम और फ़ोन भरें'));
      return;
    }
    // Check if this phone number was used before
    const savedUsers = JSON.parse(localStorage.getItem('le_users') || '{}');
    let userData;
    if (savedUsers[phone]) {
      // Returning customer - use their saved ID so order history is linked
      userData = { ...savedUsers[phone], name, phone, email: email || savedUsers[phone].email };
    } else {
      // New customer
      userData = { id: 'user_' + phone, name, phone, email };
    }
    // Save to localStorage for next time
    savedUsers[phone] = userData;
    localStorage.setItem('le_users', JSON.stringify(savedUsers));
    localStorage.setItem('le_current_user', JSON.stringify(userData));

    setUser(userData);
    toast.success(t('Welcome! 🎉', 'स्वागत है! 🎉'));
  };

  const handleLogout = () => {
    localStorage.removeItem('le_current_user');
    setUser(null);
    toast.success(t('Logged out', 'लॉग आउट हो गया'));
  };

  // If logged in, show profile
  if (user) {
    return (
      <div className="app-container">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Profile', 'प्रोफ़ाइल')}</h2>
        </div>

        <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              margin: '0 auto 12px'
            }}>
              {user.name[0].toUpperCase()}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.phone}</p>
          </div>

          {/* Stats - only show this customer's orders */}
          {(() => {
            const myOrders = orders.filter(o => o.userId === user.id || o.userPhone === user.phone);
            return (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{
                  flex: 1, background: 'var(--primary-light)',
                  borderRadius: 12, padding: '16px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{myOrders.length}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('My Orders', 'मेरे ऑर्डर')}</p>
                </div>
                <div style={{
                  flex: 1, background: '#F0FFF4',
                  borderRadius: 12, padding: '16px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>
                    {myOrders.filter(o => o.status === 'delivered').length}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('Delivered', 'डिलीवर हुए')}</p>
                </div>
              </div>
            );
          })()}

          {/* Menu items */}
          {[
            { icon: ClipboardList, label: t('My Orders', 'मेरे ऑर्डर'), path: '/orders' },
            { icon: MapPin, label: t('Addresses', 'पते'), path: null },
            { icon: Settings, label: t('Settings', 'सेटिंग्स'), path: null },
          ].map((item, i) => {
            const Icon = item.icon || Settings;
            return (
              <div
                key={i}
                onClick={() => item.path && navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: item.path ? 'pointer' : 'default'
                }}
              >
                <Icon size={20} color="var(--text-secondary)" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              </div>
            );
          })}

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--danger)',
              fontWeight: 600,
              fontSize: 14,
              background: 'none',
              marginTop: 24,
              padding: '10px 0'
            }}
          >
            <LogOut size={18} /> {t('Log Out', 'लॉग आउट')}
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Login form
  return (
    <div className="app-container">
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Login / Sign Up', 'लॉगिन / साइन अप')}</h2>
      </div>

      <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🍽️</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>LocalEats</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            {t('Your favorite local food, delivered!', 'आपका पसंदीदा स्थानीय खाना, डिलीवर!')}
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
              {t('Your Name', 'आपका नाम')} *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
              {t('Phone Number', 'फ़ोन नंबर')} *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
              {t('Email (optional)', 'ईमेल (वैकल्पिक)')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ padding: 14, fontSize: 15, marginTop: 8, borderRadius: 12 }}
            onClick={handleLogin}
          >
            {t('Continue', 'जारी रखें')}
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
