# 🍽️ LocalEats - Food Delivery App

A complete food delivery web application for your local area, built with React.

## Quick Start (3 steps!)

### Step 1: Install Node.js
Download and install from: https://nodejs.org (pick the LTS version)

### Step 2: Install dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### Step 3: Start the app
```bash
npm run dev
```
Open http://localhost:3000 in your browser. That's it!

## App URLs

| URL | What it is |
|-----|-----------|
| `/` | Customer App (main app) |
| `/admin` | Admin Dashboard |
| `/restaurant-dashboard` | Restaurant Owner Dashboard |
| `/rider` | Delivery Rider App |

## Features

### Customer App
- Browse restaurants with search and filters
- View menus with veg/non-veg indicators
- Add to cart with quantity controls
- Checkout with address and payment selection
- Order tracking with status timeline
- Hindi + English language toggle

### Admin Panel
- Dashboard with revenue and order stats
- Add/edit/delete restaurants
- Manage menus (add items, set prices, toggle availability)
- Manage all orders (update status, assign riders)
- WhatsApp notifications to restaurants

### Restaurant Dashboard
- Real-time new order notifications
- Accept/reject orders
- Mark orders as preparing/ready
- View order history

### Rider App
- Online/offline toggle
- View and accept available deliveries
- Navigate to restaurant and customer (Google Maps)
- Mark pickup and delivery
- Call customer directly

## Connecting Firebase (for real data)

1. Go to https://console.firebase.google.com
2. Create a new project called "LocalEats"
3. Click "Add App" → Web → Copy the config
4. Paste the config in `src/firebase.js`
5. Enable these Firebase services:
   - Authentication → Email/Password + Phone
   - Firestore Database
   - Storage

## Deploying for Free

### Option 1: Vercel (recommended)
1. Push your code to GitHub
2. Go to https://vercel.com
3. Sign in with GitHub
4. Import your repo → Deploy!

### Option 2: Netlify
1. Run `npm run build`
2. Go to https://netlify.com
3. Drag the `dist` folder to deploy

### Option 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Payment Setup (Razorpay)

1. Ask a parent to create a Razorpay account at https://razorpay.com
2. Get the API keys from Dashboard → Settings → API Keys
3. Install: `npm install razorpay`
4. Add integration in the Checkout page

## Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Firebase** - Database, Auth, Storage (optional, runs with demo data by default)

## Folder Structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Routes
├── index.css         # Global styles
├── firebase.js       # Firebase config
├── contexts/
│   └── AppContext.jsx # Global state management
├── components/       # Shared components
│   ├── BottomNav.jsx
│   ├── RestaurantCard.jsx
│   └── MenuItemCard.jsx
├── pages/            # Customer pages
│   ├── Home.jsx
│   ├── RestaurantPage.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderTracking.jsx
│   ├── MyOrders.jsx
│   ├── Search.jsx
│   └── Login.jsx
├── admin/            # Admin panel
│   ├── AdminDashboard.jsx
│   ├── AdminRestaurants.jsx
│   ├── AdminOrders.jsx
│   └── AdminMenu.jsx
├── restaurant/       # Restaurant dashboard
│   └── RestaurantDashboard.jsx
├── rider/            # Rider app
│   └── RiderApp.jsx
└── utils/
    ├── demoData.js   # Demo restaurants/menus
    └── helpers.js    # Utility functions
```
