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
import OrderAction from './pages/OrderAction';

// Admin pages
import AdminDashboard from './admin/AdminDashboard';
import AdminRestaurants from './admin/AdminRestaurants';
import AdminOrders from './admin/AdminOrders';
import AdminMenu from './admin/AdminMenu';

// Restaurant dashboard
import RestaurantDashboard from './restaurant/RestaurantDashboard';

// Rider app
import RiderApp from './rider/RiderApp';

// Admin password guard
import AdminGuard from './components/AdminGuard';

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

        {/* Order status update via WhatsApp links - Password Protected */}
        <Route path="/order-action/:orderId/:status" element={<AdminGuard><OrderAction /></AdminGuard>} />

        {/* Admin Panel - Password Protected */}
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/restaurants" element={<AdminGuard><AdminRestaurants /></AdminGuard>} />
        <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
        <Route path="/admin/menu/:restaurantId" element={<AdminGuard><AdminMenu /></AdminGuard>} />

        {/* Restaurant Dashboard - Password Protected */}
        <Route path="/restaurant-dashboard" element={<AdminGuard><RestaurantDashboard /></AdminGuard>} />

        {/* Rider App - Password Protected */}
        <Route path="/rider" element={<AdminGuard><RiderApp /></AdminGuard>} />

        {/* Seed Page - Password Protected */}
        <Route path="/seed" element={<AdminGuard><SeedPage /></AdminGuard>} />
      </Routes>
    </>
  );
}
