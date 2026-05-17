// Utility functions used across the app

export const formatPrice = (price) => `₹${price}`;

export const getStatusColor = (status) => {
  const colors = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    preparing: '#8B5CF6',
    ready: '#06B6D4',
    picked_up: '#6366F1',
    out_for_delivery: '#F97316',
    delivered: '#22C55E',
    cancelled: '#EF4444'
  };
  return colors[status] || '#6B7280';
};

export const getStatusText = (status, lang = 'en') => {
  const texts = {
    pending: { en: 'Order Placed', hi: 'ऑर्डर हो गया' },
    confirmed: { en: 'Confirmed', hi: 'कन्फर्म हो गया' },
    preparing: { en: 'Preparing', hi: 'बन रहा है' },
    ready: { en: 'Ready for Pickup', hi: 'पिकअप के लिए तैयार' },
    picked_up: { en: 'Picked Up', hi: 'पिक अप हो गया' },
    out_for_delivery: { en: 'Out for Delivery', hi: 'डिलीवरी के लिए निकला' },
    delivered: { en: 'Delivered', hi: 'डिलीवर हो गया' },
    cancelled: { en: 'Cancelled', hi: 'कैंसिल हो गया' }
  };
  return texts[status]?.[lang] || status;
};

export const getStatusStep = (status) => {
  const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  return steps.indexOf(status);
};

export const generateOrderId = () => {
  return 'LE' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

export const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

export const generateWhatsAppLink = (phone, order) => {
  const items = order.items.map(i => `${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
  const message = encodeURIComponent(
    `🆕 *New Order on LocalEats!*\n\n` +
    `📋 Order #${order.id}\n` +
    `👤 ${order.userName}\n` +
    `📞 ${order.userPhone}\n\n` +
    `🍽️ *Items:*\n${items}\n\n` +
    `💰 *Total: ₹${order.total}*\n` +
    `💳 Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI (Paid)'}\n\n` +
    `📍 *Deliver to:* ${order.deliveryAddress}\n\n` +
    `Please confirm the order! ✅`
  );
  return `https://wa.me/91${phone}?text=${message}`;
};
