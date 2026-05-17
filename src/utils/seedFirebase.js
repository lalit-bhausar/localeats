// ============================================
// Run this ONCE to populate your Firebase with demo data
// Usage: Open browser console and run:
//   import('/src/utils/seedFirebase.js')
// Or add a "Seed Data" button in admin panel
// ============================================

import { db } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { demoRestaurants, demoMenuItems, demoRiders } from './demoData';

export async function seedFirebase() {
  console.log('🌱 Seeding Firebase with demo data...');

  try {
    // Seed restaurants
    for (const restaurant of demoRestaurants) {
      await setDoc(doc(db, 'restaurants', restaurant.id), restaurant);
      console.log(`  ✅ Restaurant: ${restaurant.name}`);
    }

    // Seed menu items
    for (const [restaurantId, items] of Object.entries(demoMenuItems)) {
      for (const item of items) {
        await setDoc(doc(db, 'menuItems', item.id), { ...item, restaurantId });
        console.log(`  ✅ Menu item: ${item.name}`);
      }
    }

    // Seed riders
    for (const rider of demoRiders) {
      await setDoc(doc(db, 'riders', rider.id), rider);
      console.log(`  ✅ Rider: ${rider.name}`);
    }

    console.log('🎉 Firebase seeded successfully!');
    console.log(`   ${demoRestaurants.length} restaurants`);
    console.log(`   ${Object.values(demoMenuItems).flat().length} menu items`);
    console.log(`   ${demoRiders.length} riders`);

    return true;
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error);
    return false;
  }
}

// Auto-run if imported directly
// seedFirebase();
