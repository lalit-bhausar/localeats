import { useState } from 'react';

const ADMIN_PASSWORD = 'admin1280';

export default function AdminGuard({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsUnlocked(true);
    } else {
      setError('Wrong password / गलत पासवर्ड');
      setPassword('');
    }
  };

  if (isUnlocked) return children;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f5f5', padding: 20
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: 16, padding: 32,
        maxWidth: 360, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
        <h2 style={{ color: '#1a1a2e', marginBottom: 4 }}>Admin Access</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
          Enter password to continue / जारी रखने के लिए पासवर्ड डालें
        </p>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          placeholder="Enter password"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 10,
            border: `2px solid ${error ? '#ef4444' : '#ddd'}`, fontSize: 16,
            outline: 'none', boxSizing: 'border-box', marginBottom: 12
          }}
          autoFocus
        />
        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{error}</p>}
        <button type="submit" style={{
          width: '100%', padding: 14, background: '#FF6B00', color: 'white',
          border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Unlock / अनलॉक करें
        </button>
        <p style={{ color: '#aaa', fontSize: 12, marginTop: 16 }}>
          Only the owner can access this page
        </p>
      </form>
    </div>
  );
}
