import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, ClipboardList } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount, t } = useApp();
  const cartCount = getCartCount();

  const tabs = [
    { path: '/', icon: Home, label: t('Home', 'होम') },
    { path: '/search', icon: Search, label: t('Search', 'खोजें') },
    { path: '/cart', icon: ShoppingBag, label: t('Cart', 'कार्ट'), badge: cartCount },
    { path: '/orders', icon: ClipboardList, label: t('Orders', 'ऑर्डर') },
    { path: '/login', icon: User, label: t('Profile', 'प्रोफ़ाइल') }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'white',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)'
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 0 6px',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-light)',
              position: 'relative',
              transition: 'color 0.2s'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tab.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
