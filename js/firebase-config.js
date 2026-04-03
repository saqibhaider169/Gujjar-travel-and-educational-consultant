/* ===================================================
   FIREBASE CONFIG & AUTH HELPERS
   Gujjar Travel & Education Consultant
   =================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ── Firebase Init ── */
const firebaseConfig = {
  apiKey: "AIzaSyAsyGdkn_LAoUsdpqSDAilisV-Otw6RqcQ",
  authDomain: "gujjar-travel-and-education.firebaseapp.com",
  projectId: "gujjar-travel-and-education",
  storageBucket: "gujjar-travel-and-education.firebasestorage.app",
  messagingSenderId: "1052729361104",
  appId: "1:1052729361104:web:6d40666bcaefdfa49514d5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ── Global Firebase Auth Object ── */
window.FirebaseAuth = {

  /* Register new user */
  register: async (userData) => {
    const { email, password, ...profile } = userData;
    // Create account in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Save extra profile data in Firestore (NO password stored)
    const userProfile = {
      ...profile,
      email,
      uid: cred.user.uid,
      memberType: 'new',
      createdAt: new Date().toISOString(),
      applications: []
    };
    await setDoc(doc(db, "users", cred.user.uid), userProfile);
    // Cache locally
    localStorage.setItem('gte_user', JSON.stringify(userProfile));
    localStorage.setItem('gte_login_time', Date.now().toString());
    return userProfile;
  },

  /* Login existing user */
  login: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Fetch full profile from Firestore
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const userData = snap.exists()
      ? snap.data()
      : { email, uid: cred.user.uid };
    // Cache locally for fast access
    localStorage.setItem('gte_user', JSON.stringify(userData));
    localStorage.setItem('gte_login_time', Date.now().toString());
    return userData;
  },

  /* Logout */
  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('gte_user');
    localStorage.removeItem('gte_login_time');
    window.location.href = 'index.html';
  },

  /* Password reset */
  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  /* Quick checks (sync – uses cache) */
  isLoggedIn: () => !!localStorage.getItem('gte_user'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('gte_user') || 'null')
};

/* ── Auth State Listener ──
   Keeps localStorage in sync with Firebase session.
   If Firebase session expires, local cache is cleared. */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Refresh cache if missing
    if (!localStorage.getItem('gte_user')) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          localStorage.setItem('gte_user', JSON.stringify(snap.data()));
        }
      } catch (_) { /* silent */ }
    }
  } else {
    // Firebase session ended → clear cache
    localStorage.removeItem('gte_user');
    localStorage.removeItem('gte_login_time');
  }
});

console.log('%c🔥 Firebase Connected', 'color:#f97316;font-weight:bold;');
