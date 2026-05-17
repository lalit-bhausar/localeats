import { useNavigate } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../utils/helpers';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { t } = useApp();
  const r = restaurant;

  return (
    <div
      className="card fade-in"
      onClick={() => r.isOpen && navigate(`/restaurant/${r.id}`)}
      style={{
        cursor: r.isOpen ? 'pointer' : 'default',
        opacity: r.isOpen ? 1 : 0.6,
        transition: 'transform 0.2s, box-shadow 0.2s',
        marginBottom: 12,
      }}
      onMouseEnter={e => {
        if (r.isOpen) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160 }}>
        <img
          src={r.image}
          alt={r.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        {!r.isOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 18
          }}>
            {t('Currently Closed', 'अभी बंद है')}
          </div>
        )}
        {r.isVeg && (
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'var(--veg)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700
          }}>
            {t('PURE VEG', 'शुद्ध शाकाहारी')}
          </span>
        )}
        {r.deliveryFee === 0 && (
          <span style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'var(--info)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700
          }}>
            {t('FREE DELIVERY', 'फ्री डिलीवरी')}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{r.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {r.cuisine.join(' • ')}
            </p>
          </div>
          <span className="rating-badge">
            <Star size={11} fill="white" /> {r.rating}
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 10,
          fontSize: 12,
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> {r.deliveryTime} {t('min', 'मिनट')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Bike size={13} /> {r.deliveryFee > 0 ? formatPrice(r.deliveryFee) : t('Free', 'फ्री')}
          </span>
          <span>
            {t('Min', 'न्यूनतम')} {formatPrice(r.minOrder)}
          </span>
        </div>
      </div>
    </div>
  );
}
