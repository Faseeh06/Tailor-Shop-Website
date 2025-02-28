import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3G6ot448iS0XFXQAWeKxRS0ZQiJLiZPA",
  authDomain: "tailor1121.firebaseapp.com",
  projectId: "tailor1121",
  storageBucket: "tailor1121.firebasestorage.app",
  messagingSenderId: "480700285706",
  appId: "1:480700285706:web:58393dedfd6ee127a5f0f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optionally export the app instance if needed elsewhere
export default app;
