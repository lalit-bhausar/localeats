import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Mail, MapPin, LogOut, Settings, ClipboardList, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

// Simulated OTP for now. Replace with real SMS service later.
const DEMO_OTP = '1234';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, t, orders } = useApp();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'name'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const redirectTo = location.state?.from || '/';

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleSendOtp = () => {
    if (!phone.trim() || phone.length < 10) {
      toast.error(t('Please enter a valid 10-digit phone number', 'कृपया सही 10 अंकों का फ़ोन नंबर दर्ज करें'));
      return;
    }

    // In production, send real OTP here via SMS API
    // For now, OTP is 1234
    toast.success(t('OTP sent to +91' + phone, 'OTP भेजा गया +91' + phone));
    setStep('otp');
    setOtpTimer(30);

    // Auto-focus first OTP input
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      toast.error(t('Please enter 4-digit OTP', 'कृपया 4 अंकों का OTP दर्ज करें'));
      return;
    }

    setVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      if (enteredOtp === DEMO_OTP) {
        // Check if returning user
        const savedUsers = JSON.parse(localStorage.getItem('le_users') || '{}');
        if (savedUsers[phone]) {
          // Returning customer - log them in directly
          const userData = savedUsers[phone];
          localStorage.setItem('le_current_user', JSON.stringify(userData));
          setUser(userData);
          toast.success(t('Welcome back, ' + userData.name + '!', 'वापसी पर स्वागत है, ' + userData.name + '!'));
          navigate(redirectTo);
        } else {
          // New customer - ask for name
          setStep('name');
        }
      } else {
        toast.error(t('Invalid OTP. Please try again.', 'गलत OTP। कृपया फिर से कोशिश करें।'));
        setOtp(['', '', '', '']);
        otpRefs[0].current?.focus();
      }
      setVerifying(false);
    }, 800);
  };

  const handleCompleteSignup = () => {
    if (!name.trim()) {
      toast.error(t('Please enter your name', 'कृपया अपना नाम दर्ज करें'));
      return;
    }

    const userData = { id: 'user_' + phone, name: name.trim(), phone, email: email.trim() };
    const savedUsers = JSON.parse(localStorage.getItem('le_users') || '{}');
    savedUsers[phone] = userData;
    localStorage.setItem('le_users', JSON.stringify(savedUsers));
    localStorage.setItem('le_current_user', JSON.stringify(userData));

    setUser(userData);
    toast.success(t('Welcome, ' + name.trim() + '!', 'स्वागत है, ' + name.trim() + '!'));
    navigate(redirectTo);
  };

  const handleLogout = () => {
    localStorage.removeItem('le_current_user');
    setUser(null);
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '']);
    setName('');
    setEmail('');
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
              width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, margin: '0 auto 12px'
            }}>
              {user.name[0].toUpperCase()}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <Shield size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {t('Verified', 'सत्यापित')} • {user.phone}
            </p>
          </div>

          {/* Stats */}
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
              <div key={i} onClick={() => item.path && navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: item.path ? 'pointer' : 'default'
                }}>
                <Icon size={20} color="var(--text-secondary)" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              </div>
            );
          })}

          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)',
              fontWeight: 600, fontSize: 14, background: 'none', marginTop: 24, padding: '10px 0'
            }}>
            <LogOut size={18} /> {t('Log Out', 'लॉग आउट')}
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Login flow
  return (
    <div className="app-container">
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
        {step !== 'phone' && (
          <button onClick={() => { setStep(step === 'name' ? 'otp' : 'phone'); setOtp(['', '', '', '']); }}
            style={{ background: 'none', display: 'flex' }}>
            <ArrowLeft size={22} />
          </button>
        )}
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('Login / Sign Up', 'लॉगिन / साइन अप')}</h2>
      </div>

      <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>
            {step === 'phone' ? '🍽️' : step === 'otp' ? '🔐' : '👋'}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>LocalEats</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            {step === 'phone' && t('Your favorite local food, delivered!', 'आपका पसंदीदा स्थानीय खाना, डिलीवर!')}
            {step === 'otp' && t('Verify your phone number', 'अपना फ़ोन नंबर सत्यापित करें')}
            {step === 'name' && t('Almost done! Tell us your name', 'बस एक कदम! अपना नाम बताएं')}
          </p>
        </div>

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                {t('Phone Number', 'फ़ोन नंबर')} *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 14, fontWeight: 600, color: '#666'
                }}>+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{ paddingLeft: 48, fontSize: 16, letterSpacing: 1 }}
                  autoFocus
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ padding: 14, fontSize: 15, marginTop: 8, borderRadius: 12 }}
              onClick={handleSendOtp}
              disabled={phone.length < 10}
            >
              {t('Send OTP', 'OTP भेजें')}
            </button>

            <p style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 4 }}>
              {t('We will send you a 4-digit verification code', 'हम आपको 4 अंकों का सत्यापन कोड भेजेंगे')}
            </p>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              {t('Enter the OTP sent to', 'OTP दर्ज करें जो भेजा गया')} <strong>+91{phone}</strong>
            </p>

            {/* OTP Input boxes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: 56, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700,
                    borderRadius: 12, border: '2px solid ' + (digit ? 'var(--primary)' : 'var(--border)'),
                    outline: 'none', caretColor: 'var(--primary)'
                  }}
                />
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ padding: 14, fontSize: 15, borderRadius: 12 }}
              onClick={handleVerifyOtp}
              disabled={verifying || otp.join('').length < 4}
            >
              {verifying
                ? t('Verifying...', 'सत्यापित हो रहा है...')
                : t('Verify OTP', 'OTP सत्यापित करें')
              }
            </button>

            {/* Resend OTP */}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              {otpTimer > 0 ? (
                <p style={{ fontSize: 13, color: '#999' }}>
                  {t('Resend OTP in', 'OTP फिर भेजें')} <strong>{otpTimer}s</strong>
                </p>
              ) : (
                <button onClick={() => { handleSendOtp(); setOtp(['', '', '', '']); }}
                  style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  {t('Resend OTP', 'OTP फिर भेजें')}
                </button>
              )}
            </div>

            {/* Hint for demo */}
            <div style={{
              background: '#FFF8E1', borderRadius: 8, padding: '10px 14px',
              fontSize: 12, color: '#F59E0B', textAlign: 'center', marginTop: 8
            }}>
              {t('Demo OTP: 1234', 'डेमो OTP: 1234')}
            </div>
          </div>
        )}

        {/* Step 3: Name (new users only) */}
        {step === 'name' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: '#F0FFF4', borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: '#22C55E', textAlign: 'center', fontWeight: 600
            }}>
              {t('Phone verified successfully!', 'फ़ोन सफलतापूर्वक सत्यापित!')} +91{phone}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                {t('Your Name', 'आपका नाम')} *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input type="text" placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: 36 }} autoFocus />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                {t('Email (optional)', 'ईमेल (वैकल्पिक)')}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 36 }} />
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ padding: 14, fontSize: 15, marginTop: 8, borderRadius: 12 }}
              onClick={handleCompleteSignup}
            >
              {t('Start Ordering', 'ऑर्डर करना शुरू करें')}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
