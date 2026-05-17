import { useState } from 'react';
import { demoRestaurants, demoMenuItems, demoRiders } from '../utils/demoData';

const PROJECT_ID = 'localeats-48917';
const API_KEY = 'AIzaSyBld5pyMVMqcBEBHVYBPs0YX4CU5uNr0y8';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Convert JS value to Firestore REST format
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'id') continue; // skip id field, it's the doc name
    fields[key] = toFirestoreValue(value);
  }
  return { fields };
}

async function writeDoc(collection, docId, data) {
  const url = `${BASE_URL}/${collection}/${docId}?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toFirestoreDoc(data))
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status}: ${err}`);
  }
  return response.json();
}

export default function SeedPage() {
  const [status, setStatus] = useState('ready');
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const seedData = async () => {
    setStatus('seeding');
    setLogs([]);
    setProgress(0);

    const totalItems = demoRestaurants.length +
      Object.values(demoMenuItems).flat().length +
      demoRiders.length;
    let done = 0;
    let failed = 0;

    try {
      // Seed restaurants
      for (const restaurant of demoRestaurants) {
        try {
          await writeDoc('restaurants', restaurant.id, restaurant);
          done++;
          setProgress(Math.round((done / totalItems) * 100));
          addLog(`✅ Restaurant: ${restaurant.name}`);
        } catch (err) {
          failed++;
          addLog(`❌ Failed: ${restaurant.name} - ${err.message}`);
        }
      }

      // Seed menu items
      for (const [restaurantId, items] of Object.entries(demoMenuItems)) {
        for (const item of items) {
          try {
            await writeDoc('menuItems', item.id, { ...item, restaurantId });
            done++;
            setProgress(Math.round(((done + failed) / totalItems) * 100));
            addLog(`✅ Menu: ${item.name}`);
          } catch (err) {
            failed++;
            addLog(`❌ Failed: ${item.name} - ${err.message}`);
          }
        }
      }

      // Seed riders
      for (const rider of demoRiders) {
        try {
          await writeDoc('riders', rider.id, rider);
          done++;
          setProgress(Math.round(((done + failed) / totalItems) * 100));
          addLog(`✅ Rider: ${rider.name}`);
        } catch (err) {
          failed++;
          addLog(`❌ Failed: ${rider.name} - ${err.message}`);
        }
      }

      setStatus('done');
      addLog(`🎉 Done! ${done} succeeded, ${failed} failed out of ${totalItems} total.`);
    } catch (error) {
      setStatus('error');
      addLog(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#FF6B00', textAlign: 'center' }}>🌱 Seed Demo Data</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Click the button below to load 6 restaurants, 35 menu items, and 3 riders into your Firebase database.
      </p>

      {status === 'ready' && (
        <button
          onClick={seedData}
          style={{
            display: 'block', width: '100%', padding: '16px',
            background: '#FF6B00', color: 'white', border: 'none',
            borderRadius: 12, fontSize: 18, fontWeight: 'bold',
            cursor: 'pointer', marginTop: 20
          }}
        >
          🚀 Load Demo Data
        </button>
      )}

      {status === 'seeding' && (
        <div style={{ marginTop: 20 }}>
          <div style={{ background: '#eee', borderRadius: 10, overflow: 'hidden', height: 30 }}>
            <div style={{
              width: `${progress}%`, background: '#FF6B00', height: '100%',
              borderRadius: 10, transition: 'width 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold', fontSize: 14
            }}>
              {progress}%
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: 8 }}>Adding data... please wait</p>
        </div>
      )}

      {status === 'done' && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 24 }}>🎉</p>
          <p style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>Data loaded successfully!</p>
          <a href="/" style={{
            display: 'inline-block', marginTop: 12, padding: '12px 24px',
            background: '#FF6B00', color: 'white', borderRadius: 10,
            textDecoration: 'none', fontWeight: 'bold'
          }}>
            Go to Home Page →
          </a>
        </div>
      )}

      {logs.length > 0 && (
        <div style={{
          marginTop: 20, background: '#1a1a2e', borderRadius: 10,
          padding: 16, maxHeight: 300, overflowY: 'auto'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ color: '#ddd', fontSize: 13, padding: '2px 0', fontFamily: 'monospace' }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
