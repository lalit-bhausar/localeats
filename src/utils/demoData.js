// Demo data so the app works before Firebase is connected
// This lets you see and test all features immediately

export const demoRestaurants = [
  {
    id: 'rest1',
    name: 'Sharma Ji Ka Dhaba',
    nameHi: 'शर्मा जी का ढाबा',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    cuisine: ['North Indian', 'Chinese'],
    rating: 4.3,
    totalRatings: 230,
    deliveryTime: '25-35',
    deliveryFee: 20,
    minOrder: 150,
    isOpen: true,
    isVeg: false,
    address: 'Main Market, Near Bus Stand',
    phone: '9876543210',
    description: 'Famous for butter chicken and dal makhani since 1995'
  },
  {
    id: 'rest2',
    name: 'Green Leaf Pure Veg',
    nameHi: 'ग्रीन लीफ प्योर वेज',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
    cuisine: ['South Indian', 'North Indian'],
    rating: 4.5,
    totalRatings: 180,
    deliveryTime: '20-30',
    deliveryFee: 15,
    minOrder: 100,
    isOpen: true,
    isVeg: true,
    address: 'Gandhi Chowk, Shop No. 12',
    phone: '9876543211',
    description: 'Pure vegetarian family restaurant with homestyle cooking'
  },
  {
    id: 'rest3',
    name: 'Pizza Point',
    nameHi: 'पिज़्ज़ा पॉइंट',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop',
    cuisine: ['Italian', 'Fast Food'],
    rating: 4.1,
    totalRatings: 320,
    deliveryTime: '30-40',
    deliveryFee: 25,
    minOrder: 200,
    isOpen: true,
    isVeg: false,
    address: 'College Road, Near Railway Station',
    phone: '9876543212',
    description: 'Best pizzas, burgers, and pasta in town'
  },
  {
    id: 'rest4',
    name: 'Chacha Ji Ke Chole Bhature',
    nameHi: 'चाचा जी के छोले भटूरे',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=250&fit=crop',
    cuisine: ['Street Food', 'North Indian'],
    rating: 4.6,
    totalRatings: 450,
    deliveryTime: '15-25',
    deliveryFee: 10,
    minOrder: 80,
    isOpen: true,
    isVeg: true,
    address: 'Station Road, Opposite Park',
    phone: '9876543213',
    description: 'Famous chole bhature since 30 years!'
  },
  {
    id: 'rest5',
    name: 'Royal Biryani House',
    nameHi: 'रॉयल बिरयानी हाउस',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop',
    cuisine: ['Mughlai', 'Biryani'],
    rating: 4.4,
    totalRatings: 290,
    deliveryTime: '35-45',
    deliveryFee: 30,
    minOrder: 200,
    isOpen: false,
    isVeg: false,
    address: 'Civil Lines, Near Hospital',
    phone: '9876543214',
    description: 'Authentic Hyderabadi biryani and kebabs'
  },
  {
    id: 'rest6',
    name: 'Juice Junction & Shakes',
    nameHi: 'जूस जंक्शन एंड शेक्स',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=250&fit=crop',
    cuisine: ['Beverages', 'Desserts'],
    rating: 4.2,
    totalRatings: 150,
    deliveryTime: '15-20',
    deliveryFee: 15,
    minOrder: 60,
    isOpen: true,
    isVeg: true,
    address: 'Market Road, Shop No. 5',
    phone: '9876543215',
    description: 'Fresh fruit juices, milkshakes, and ice cream'
  }
];

export const demoMenuItems = {
  rest1: [
    { id: 'm1', name: 'Butter Chicken', nameHi: 'बटर चिकन', price: 280, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop', category: 'Main Course', isVeg: false, isAvailable: true, isBestseller: true, description: 'Creamy tomato gravy with tender chicken pieces' },
    { id: 'm2', name: 'Dal Makhani', nameHi: 'दाल मखनी', price: 180, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop', category: 'Main Course', isVeg: true, isAvailable: true, isBestseller: true, description: 'Slow-cooked black lentils in butter and cream' },
    { id: 'm3', name: 'Paneer Tikka', nameHi: 'पनीर टिक्का', price: 220, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop', category: 'Starters', isVeg: true, isAvailable: true, isBestseller: false, description: 'Grilled cottage cheese with spices' },
    { id: 'm4', name: 'Chicken Biryani', nameHi: 'चिकन बिरयानी', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', category: 'Rice', isVeg: false, isAvailable: true, isBestseller: true, description: 'Fragrant basmati rice with spiced chicken' },
    { id: 'm5', name: 'Naan', nameHi: 'नान', price: 40, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop', category: 'Breads', isVeg: true, isAvailable: true, isBestseller: false, description: 'Soft tandoori naan' },
    { id: 'm6', name: 'Butter Naan', nameHi: 'बटर नान', price: 50, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop', category: 'Breads', isVeg: true, isAvailable: true, isBestseller: false, description: 'Naan with butter' },
    { id: 'm7', name: 'Gulab Jamun', nameHi: 'गुलाब जामुन', price: 80, image: 'https://images.unsplash.com/photo-1666190063000-89a0e7537b20?w=200&h=200&fit=crop', category: 'Desserts', isVeg: true, isAvailable: true, isBestseller: false, description: '2 pieces of sweet gulab jamun' },
    { id: 'm8', name: 'Hakka Noodles', nameHi: 'हक्का नूडल्स', price: 160, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop', category: 'Chinese', isVeg: true, isAvailable: true, isBestseller: false, description: 'Stir-fried noodles with vegetables' },
    { id: 'm9', name: 'Manchurian', nameHi: 'मंचूरियन', price: 180, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=200&h=200&fit=crop', category: 'Chinese', isVeg: true, isAvailable: true, isBestseller: false, description: 'Crispy veg balls in spicy sauce' },
    { id: 'm10', name: 'Lassi', nameHi: 'लस्सी', price: 60, image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=200&h=200&fit=crop', category: 'Beverages', isVeg: true, isAvailable: true, isBestseller: false, description: 'Sweet creamy lassi' }
  ],
  rest2: [
    { id: 'm11', name: 'Masala Dosa', nameHi: 'मसाला डोसा', price: 120, category: 'South Indian', isVeg: true, isAvailable: true, isBestseller: true, description: 'Crispy dosa with potato filling' },
    { id: 'm12', name: 'Idli Sambar', nameHi: 'इडली सांभर', price: 80, category: 'South Indian', isVeg: true, isAvailable: true, isBestseller: false, description: '4 soft idlis with sambar and chutney' },
    { id: 'm13', name: 'Chole Bhature', nameHi: 'छोले भटूरे', price: 100, category: 'North Indian', isVeg: true, isAvailable: true, isBestseller: true, description: 'Spicy chickpeas with fried bread' },
    { id: 'm14', name: 'Paneer Butter Masala', nameHi: 'पनीर बटर मसाला', price: 200, category: 'Main Course', isVeg: true, isAvailable: true, isBestseller: true, description: 'Cottage cheese in rich tomato gravy' },
    { id: 'm15', name: 'Veg Thali', nameHi: 'वेज थाली', price: 150, category: 'Thali', isVeg: true, isAvailable: true, isBestseller: true, description: 'Complete meal: dal, sabzi, rice, roti, salad, sweet' },
    { id: 'm16', name: 'Aloo Paratha', nameHi: 'आलू पराठा', price: 70, category: 'Breads', isVeg: true, isAvailable: true, isBestseller: false, description: 'Stuffed potato paratha with curd and pickle' }
  ],
  rest3: [
    { id: 'm17', name: 'Margherita Pizza', nameHi: 'मार्गेरिटा पिज़्ज़ा', price: 199, category: 'Pizza', isVeg: true, isAvailable: true, isBestseller: true, description: 'Classic cheese and tomato pizza' },
    { id: 'm18', name: 'Chicken Tikka Pizza', nameHi: 'चिकन टिक्का पिज़्ज़ा', price: 299, category: 'Pizza', isVeg: false, isAvailable: true, isBestseller: true, description: 'Loaded with spiced chicken tikka' },
    { id: 'm19', name: 'Veg Burger', nameHi: 'वेज बर्गर', price: 99, category: 'Burgers', isVeg: true, isAvailable: true, isBestseller: false, description: 'Crispy veg patty burger' },
    { id: 'm20', name: 'French Fries', nameHi: 'फ्रेंच फ्राइज़', price: 89, category: 'Sides', isVeg: true, isAvailable: true, isBestseller: false, description: 'Crispy golden fries with sauce' },
    { id: 'm21', name: 'Pasta Alfredo', nameHi: 'पास्ता अल्फ्रेडो', price: 179, category: 'Pasta', isVeg: true, isAvailable: true, isBestseller: false, description: 'Creamy white sauce pasta' },
    { id: 'm22', name: 'Cold Coffee', nameHi: 'कोल्ड कॉफ़ी', price: 99, category: 'Beverages', isVeg: true, isAvailable: true, isBestseller: false, description: 'Chilled coffee with ice cream' }
  ],
  rest4: [
    { id: 'm23', name: 'Chole Bhature', nameHi: 'छोले भटूरे', price: 80, category: 'Main', isVeg: true, isAvailable: true, isBestseller: true, description: 'Our famous chole bhature!' },
    { id: 'm24', name: 'Aloo Tikki', nameHi: 'आलू टिक्की', price: 50, category: 'Snacks', isVeg: true, isAvailable: true, isBestseller: true, description: 'Crispy potato patties with chutney' },
    { id: 'm25', name: 'Samosa (2 pcs)', nameHi: 'समोसा (2 पीस)', price: 30, category: 'Snacks', isVeg: true, isAvailable: true, isBestseller: true, description: 'Crispy samosa with potato filling' },
    { id: 'm26', name: 'Pav Bhaji', nameHi: 'पाव भाजी', price: 90, category: 'Main', isVeg: true, isAvailable: true, isBestseller: false, description: 'Spicy mixed veg bhaji with butter pav' },
    { id: 'm27', name: 'Lassi', nameHi: 'लस्सी', price: 40, category: 'Beverages', isVeg: true, isAvailable: true, isBestseller: false, description: 'Sweet punjabi lassi' }
  ],
  rest5: [
    { id: 'm28', name: 'Hyderabadi Biryani', nameHi: 'हैदराबादी बिरयानी', price: 280, category: 'Biryani', isVeg: false, isAvailable: true, isBestseller: true, description: 'Authentic dum biryani with raita' },
    { id: 'm29', name: 'Seekh Kebab', nameHi: 'सीख कबाब', price: 220, category: 'Starters', isVeg: false, isAvailable: true, isBestseller: true, description: 'Minced meat kebabs on skewers' },
    { id: 'm30', name: 'Veg Biryani', nameHi: 'वेज बिरयानी', price: 180, category: 'Biryani', isVeg: true, isAvailable: true, isBestseller: false, description: 'Fragrant vegetable biryani' },
    { id: 'm31', name: 'Mutton Korma', nameHi: 'मटन कोरमा', price: 320, category: 'Main Course', isVeg: false, isAvailable: true, isBestseller: false, description: 'Rich and creamy mutton curry' }
  ],
  rest6: [
    { id: 'm32', name: 'Mango Shake', nameHi: 'मैंगो शेक', price: 80, category: 'Shakes', isVeg: true, isAvailable: true, isBestseller: true, description: 'Thick mango milkshake' },
    { id: 'm33', name: 'Mixed Fruit Juice', nameHi: 'मिक्स्ड फ्रूट जूस', price: 70, category: 'Juices', isVeg: true, isAvailable: true, isBestseller: false, description: 'Fresh seasonal fruit juice' },
    { id: 'm34', name: 'Oreo Shake', nameHi: 'ओरियो शेक', price: 100, category: 'Shakes', isVeg: true, isAvailable: true, isBestseller: true, description: 'Creamy Oreo milkshake' },
    { id: 'm35', name: 'Chocolate Ice Cream', nameHi: 'चॉकलेट आइसक्रीम', price: 60, category: 'Ice Cream', isVeg: true, isAvailable: true, isBestseller: false, description: 'Rich chocolate ice cream scoop' }
  ]
};

export const demoOrders = [
  {
    id: 'ord1',
    userId: 'user1',
    userName: 'Rahul Kumar',
    userPhone: '9876500001',
    restaurantId: 'rest1',
    restaurantName: 'Sharma Ji Ka Dhaba',
    items: [
      { name: 'Butter Chicken', qty: 1, price: 280 },
      { name: 'Naan', qty: 3, price: 40 },
      { name: 'Dal Makhani', qty: 1, price: 180 }
    ],
    subtotal: 580,
    deliveryFee: 20,
    total: 600,
    status: 'delivered',
    paymentMethod: 'cod',
    deliveryAddress: '45, Sector 3, Near Park',
    riderId: 'rider1',
    riderName: 'Amit',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    estimatedDelivery: '35 min'
  },
  {
    id: 'ord2',
    userId: 'user1',
    userName: 'Rahul Kumar',
    userPhone: '9876500001',
    restaurantId: 'rest3',
    restaurantName: 'Pizza Point',
    items: [
      { name: 'Margherita Pizza', qty: 2, price: 199 },
      { name: 'French Fries', qty: 1, price: 89 },
      { name: 'Cold Coffee', qty: 2, price: 99 }
    ],
    subtotal: 685,
    deliveryFee: 25,
    total: 710,
    status: 'preparing',
    paymentMethod: 'upi',
    deliveryAddress: '45, Sector 3, Near Park',
    riderId: null,
    riderName: null,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '40 min'
  }
];

export const demoRiders = [
  { id: 'rider1', name: 'Amit Kumar', phone: '9876500010', isAvailable: true, rating: 4.7, totalDeliveries: 234 },
  { id: 'rider2', name: 'Ravi Singh', phone: '9876500011', isAvailable: false, rating: 4.5, totalDeliveries: 189 },
  { id: 'rider3', name: 'Sanjay Verma', phone: '9876500012', isAvailable: true, rating: 4.8, totalDeliveries: 312 }
];
