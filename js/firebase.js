import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, push, set, update, remove, onValue, get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo_tUSBQHNuR12yGN9UZHl7cKK3RwQjQc",
  authDomain: "annidhomiyah-web.firebaseapp.com",
  databaseURL: "https://annidhomiyah-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "annidhomiyah-web",
  storageBucket: "annidhomiyah-web.firebasestorage.app",
  messagingSenderId: "214286537603",
  appId: "1:214286537603:web:58401921a39e332a36dcb6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

/* ===================== AUTH ===================== */
window.fbLogin = (email, password) => signInWithEmailAndPassword(auth, email, password);
window.fbLogout = () => signOut(auth);
window.fbChangePassword = (newPassword) => {
  if (!auth.currentUser) return Promise.reject(new Error("Belum login"));
  return updatePassword(auth.currentUser, newPassword);
};
window.fbOnAuthChange = (cb) => onAuthStateChanged(auth, cb);

/* ===================== SETTINGS (profil, hero, kontak, logo) ===================== */
window.fbGetSettings = (cb) => {
  onValue(ref(db, "settings"), (snap) => cb(snap.val() || {}));
};
window.fbSaveSettings = (partial) => update(ref(db, "settings"), partial);

/* ===================== PROGRAM ===================== */
window.fbAddProgram = (data) => push(ref(db, "programs"), { ...data, createdAt: Date.now() });
window.fbFetchPrograms = (cb) => {
  onValue(ref(db, "programs"), (snap) => {
    const data = snap.val();
    cb(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b)=>a.createdAt-b.createdAt) : []);
  });
};
window.fbDeleteProgram = (id) => remove(ref(db, `programs/${id}`));

/* ===================== BERITA ===================== */
window.fbAddNews = (data) => push(ref(db, "news"), { ...data, createdAt: Date.now() });
window.fbUpdateNews = (id, data) => update(ref(db, `news/${id}`), data);
window.fbFetchNews = (cb) => {
  onValue(ref(db, "news"), (snap) => {
    const data = snap.val();
    const list = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
    list.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.createdAt - a.createdAt);
    cb(list);
  });
};
window.fbDeleteNews = (id) => remove(ref(db, `news/${id}`));

/* ===================== GALLERY ===================== */
window.fbAddGalleryPhoto = (data) => push(ref(db, "gallery"), { ...data, createdAt: Date.now() });
window.fbFetchGallery = (cb) => {
  onValue(ref(db, "gallery"), (snap) => {
    const data = snap.val();
    cb(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : []);
  });
};
window.fbDeleteGalleryPhoto = (id) => remove(ref(db, `gallery/${id}`));

/* ===================== GALLERY CATEGORIES ===================== */
window.fbAddCategory = (name) => push(ref(db, "galleryCategories"), { name, createdAt: Date.now() });
window.fbFetchCategories = (cb) => {
  onValue(ref(db, "galleryCategories"), (snap) => {
    const data = snap.val();
    cb(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b)=>a.createdAt-b.createdAt) : []);
  });
};
window.fbDeleteCategory = (id) => remove(ref(db, `galleryCategories/${id}`));

window.__fbReady = true;
