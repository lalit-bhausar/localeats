import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Customer pages
import Home from './pages/Home';
import RestaurantPage from './pages/RestaurantPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Search from './pages/Search';
import SeedPage from './pages/SeedPage';

// Admin pages
import AdminDashboard from './admin/AdminDashboard';
import AdminRestaurants from './admin/AdminRestaurants';
import AdminOrders from './admin/AdminOrders';
import AdminMenu from './admin/AdminMenu';

// Restaurant dashboard
import RestaurantDashboard from './restaurant/RestaurantDashboard';

// Rider app
import RiderApp from './rider/RiderApp';

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontSize: '14px', borderRadius: '10px', padding: '12px 16px' },
          success: { duration: 2000 },
          error: { duration: 3000 }
        }}
      />
      <Routes>
        {/* Customer App */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderTracking />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/seed" element={<SeedPage />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/menu/:restaurantId" element={<AdminMenu />} />

        {/* Restaurant Dashboard */}
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />

        {/* Rider App */}
        <Route path="/rider" element={<RiderApp />} />
      </Routes>
    </>
  );
}
