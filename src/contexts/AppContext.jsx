import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { demoRestaurants, demoMenuItems, demoOrders, demoRiders } from '../utils/demoData';

// Firebase imports - only used when configured
let db = null;
let firestoreReady = false;

// Firebase disabled temporarily - using demo data
// To re-enable: uncomment the block below and set firestoreReady = true
/*
try {
  const firebase = await import('../firebase.js');
  db = firebase.db;
  if (db && !firebase.default.options.apiKey?.startsWith('YOUR_')) {
    firestoreReady = true;
  }
} catch (e) {
  console.log('Firebase not configured, using demo data');
}
*/
console.log('🍽️ LocalEats running with demo data!');

// Lazy-load Firestore functions only when needed
let firestoreFns = null;
const getFirestoreFns = async () => {
  if (!firestoreFns && firestoreReady) {
    firestoreFns = await import('firebase/firestore');
  }
  return firestoreFns;
};

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [riders, setRiders] = useState([]);
  const [lang, setLang] = useState('en');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(firestoreReady);

  // ============================================
  // LOAD DATA - Firebase or Demo
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      if (useFirebase) {
        try {
          const fs = await getFirestoreFns();
          const { collection, getDocs, query, orderBy, onSnapshot } = fs;

          // Load restaurants
          const restSnap = await getDocs(collection(db, 'restaurants'));
          const restData = restSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRestaurants(restData.length > 0 ? restData : demoRestaurants);

          // Load menu items grouped by restaurant
          const menuSnap = await getDocs(collection(db, 'menuItems'));
          const menuData = {};
          menuSnap.docs.forEach(doc => {
            const item = { id: doc.id, ...doc.data() };
            const restId = item.restaurantId;
            if (!menuData[restId]) menuData[restId] = [];
            menuData[restId].push(item);
          });
          setMenuItems(Object.keys(menuData).length > 0 ? menuData : demoMenuItems);

          // Load riders
          const riderSnap = await getDocs(collection(db, 'riders'));
          const riderData = riderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRiders(riderData.length > 0 ? riderData : demoRiders);

          // Listen to orders in real-time!
          const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
          onSnapshot(ordersQuery, (snapshot) => {
            const orderData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(orderData);
          });

          console.log('✅ Connected to Firebase!');
        } catch (err) {
          console.error('Firebase load error, falling back to demo:', err);
          setUseFirebase(false);
          setRestaurants(demoRestaurants);
          setMenuItems(demoMenuItems);
          setOrders(demoOrders);
          setRiders(demoRiders);
        }
      } else {
        // Use demo data
        setRestaurants(demoRestaurants);
        setMenuItems(demoMenuItems);
        setOrders(demoOrders);
        setRiders(demoRiders);
      }
      setLoading(false);
    };

    loadData();
  }, [useFirebase]);

  // ============================================
  // CART FUNCTIONS (local only, no Firebase needed)
  // ============================================
  const addToCart = (item, restaurant) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      if (!window.confirm(lang === 'en'
        ? 'Adding items from a different restaurant will clear your current cart. Continue?'
        : 'दूसरे रेस्तरां से आइटम जोड़ने पर आपका मौजूदा कार्ट खाली हो जाएगा। जारी रखें?'
      )) return;
      setCart([]);
    }
    setCartRestaurant(restaurant);
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map(c => c.id === itemId ? { ...c, qty: c.qty - 1 } : c);
      }
      const newCart = prev.filter(c => c.id !== itemId);
      if (newCart.length === 0) setCartRestaurant(null);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
  };

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  // ============================================
  // ORDER FUNCTIONS
  // ============================================
  const placeOrder = useCallback(async (paymentMethod) => {
    const orderId = 'LE' + Date.now().toString(36).toUpperCase();
    const newOrder = {
      id: orderId,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      userPhone: user?.phone || '',
      restaurantId: cartRestaurant.id,
      restaurantName: cartRestaurant.name,
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal: getCartTotal(),
      deliveryFee: cartRestaurant.deliveryFee || 20,
      total: getCartTotal() + (cartRestaurant.deliveryFee || 20),
      status: 'pending',
      paymentMethod,
      deliveryAddress,
      riderId: null,
      riderName: null,
      createdAt: new Date().toISOString(),
      estimatedDelivery: cartRestaurant.deliveryTime || '30-40 min'
    };

    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, setDoc } = fs;
        await setDoc(doc(db, 'orders', orderId), newOrder);
        // Real-time listener will auto-update the orders list
      } catch (err) {
        console.error('Error saving order to Firebase:', err);
        setOrders(prev => [newOrder, ...prev]);
      }
    } else {
      setOrders(prev => [newOrder, ...prev]);
    }

    clearCart();
    return newOrder;
  }, [user, cart, cartRestaurant, deliveryAddress, useFirebase]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, updateDoc } = fs;
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch (err) {
        console.error('Error updating order:', err);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  }, [useFirebase]);

  const assignRider = useCallback(async (orderId, rider) => {
    const update = { riderId: rider.id, riderName: rider.name };
    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, updateDoc } = fs;
        await updateDoc(doc(db, 'orders', orderId), update);
      } catch (err) {
        console.error('Error assigning rider:', err);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...update } : o));
      }
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...update } : o));
    }
  }, [useFirebase]);

  // ============================================
  // RESTAURANT MANAGEMENT (Admin)
  // ============================================
  const addRestaurant = useCallback(async (restaurant) => {
    const id = 'rest' + Date.now();
    const newRest = { ...restaurant, id };

    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, setDoc } = fs;
        await setDoc(doc(db, 'restaurants', id), newRest);
      } catch (err) {
        console.error('Error adding restaurant:', err);
      }
    }
    setRestaurants(prev => [...prev, newRest]);
    setMenuItems(prev => ({ ...prev, [id]: [] }));
    return id;
  }, [useFirebase]);

  const updateRestaurant = useCallback(async (id, data) => {
    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, updateDoc } = fs;
        await updateDoc(doc(db, 'restaurants', id), data);
      } catch (err) {
        console.error('Error updating restaurant:', err);
      }
    }
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  }, [useFirebase]);

  const addMenuItem = useCallback(async (restaurantId, item) => {
    const id = 'm' + Date.now();
    const newItem = { ...item, id, restaurantId };

    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, setDoc } = fs;
        await setDoc(doc(db, 'menuItems', id), newItem);
      } catch (err) {
        console.error('Error adding menu item:', err);
      }
    }
    setMenuItems(prev => ({
      ...prev,
      [restaurantId]: [...(prev[restaurantId] || []), newItem]
    }));
  }, [useFirebase]);

  const updateMenuItem = useCallback(async (restaurantId, itemId, data) => {
    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, updateDoc } = fs;
        await updateDoc(doc(db, 'menuItems', itemId), data);
      } catch (err) {
        console.error('Error updating menu item:', err);
      }
    }
    setMenuItems(prev => ({
      ...prev,
      [restaurantId]: prev[restaurantId].map(i => i.id === itemId ? { ...i, ...data } : i)
    }));
  }, [useFirebase]);

  const deleteMenuItem = useCallback(async (restaurantId, itemId) => {
    if (useFirebase) {
      try {
        const fs = await getFirestoreFns();
        const { doc, deleteDoc } = fs;
        await deleteDoc(doc(db, 'menuItems', itemId));
      } catch (err) {
        console.error('Error deleting menu item:', err);
      }
    }
    setMenuItems(prev => ({
      ...prev,
      [restaurantId]: prev[restaurantId].filter(i => i.id !== itemId)
    }));
  }, [useFirebase]);

  // Toggle language
  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');
  const t = (en, hi) => lang === 'en' ? en : hi;

  const value = {
    user, setUser,
    cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount, cartRestaurant,
    orders, placeOrder, updateOrderStatus, assignRider,
    restaurants, addRestaurant, updateRestaurant,
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    riders, setRiders,
    lang, toggleLang, t,
    deliveryAddress, setDeliveryAddress,
    searchQuery, setSearchQuery,
    loading, useFirebase
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
