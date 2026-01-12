import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/**
 * Converts ESP32 Analog Raw Values (0-4095) to Moisture %
 * Based on typical capacitive sensor: ~3000 (dry) to ~1500 (wet)
 */
export const mapRawToMoisture = (raw: number) => {
    const dry = 3200;
    const wet = 1500;
    let moisture = ((dry - raw) / (dry - wet)) * 100;
    return Math.min(Math.max(parseFloat(moisture.toFixed(1)), 0), 100);
};

export { db, doc, onSnapshot };
