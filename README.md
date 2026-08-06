# Website Profil — Yayasan Pondok Pesantren An-Nidhomiyah

## Struktur Folder
```
pondok/
├── index.html
├── firebase.json
├── database.rules.json
├── .github/workflows/deploy.yml
├── css/style.css
├── js/
│   ├── firebase.js   (config, Auth, Realtime Database)
│   └── main.js       (render halaman + logic dashboard admin)
└── images/            (placeholder logo, hero, foto pengasuh)
```

Semua konten (hero, profil, sejarah, kontak, sosmed, program, berita, galeri, logo)
disimpan di **Firebase Realtime Database** dan bisa diubah lewat **Dashboard Admin**
di pojok kanan bawah website — tanpa perlu edit kode atau redeploy.

---

## 1. Buat Project Firebase Baru

1. Buka https://console.firebase.google.com → **Add project** → beri nama misalnya `annidhomiyah-web`.
2. Setelah project dibuat, klik ikon **Web (`</>`)** untuk mendaftarkan web app → beri nickname `annidhomiyah` → **Register app**.
3. Copy objek `firebaseConfig` yang muncul, lalu paste ke `js/firebase.js` menggantikan bagian:
   ```js
   const firebaseConfig = {
     apiKey: "GANTI_DENGAN_API_KEY",
     authDomain: "GANTI.firebaseapp.com",
     databaseURL: "https://GANTI-default-rtdb.firebaseio.com/",
     projectId: "GANTI",
     storageBucket: "GANTI.firebasestorage.app",
     messagingSenderId: "GANTI",
     appId: "GANTI"
   };
   ```

## 2. Aktifkan Realtime Database

1. Di sidebar Firebase Console → **Build → Realtime Database** → **Create Database**.
2. Pilih lokasi (misalnya `asia-southeast1`), mode **Start in locked mode** (aturan sudah kita atur lewat `database.rules.json`).

## 3. Aktifkan Authentication (Login Admin)

1. Sidebar → **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → aktifkan provider **Email/Password**.
3. Tab **Users** → **Add user** → masukkan email & password admin (misalnya `admin@annidhomiyah.id`).
   Ini akun yang dipakai untuk login di dashboard admin website — **pendaftaran publik dimatikan**,
   jadi hanya akun yang kamu buat manual di sini yang bisa login.
4. Kamu bisa menambah admin lain kapan saja dengan menambah user baru di tab ini.

## 4. Install Firebase CLI & Login

```bash
npm install -g firebase-tools
firebase login
```

## 5. Hubungkan Folder ke Project

```bash
cd pondok
firebase use --add
# pilih project Firebase yang baru dibuat, beri alias "default"
```

## 6. Deploy Rules & Hosting (manual, sekali di awal)

```bash
firebase deploy --only database
firebase deploy --only hosting
```

## 7. Setup Auto-Deploy via GitHub Actions

1. Generate token CI:
   ```bash
   firebase login:ci
   ```
2. Di repo GitHub → **Settings → Secrets and variables → Actions → New repository secret**
   → nama `FIREBASE_TOKEN`, value = token dari langkah di atas.
3. Buka `.github/workflows/deploy.yml`, ganti `GANTI_PROJECT_ID` dengan Project ID Firebase-mu (terlihat di Project Settings).
4. Setiap `git push` ke branch `main`, GitHub Actions otomatis menjalankan `firebase deploy --only hosting,database`.

---

## Cara Pakai Dashboard Admin

1. Buka website → klik ikon 🔒 di pojok kanan bawah.
2. Login pakai email & password admin yang dibuat di langkah 3 di atas.
3. Tab yang tersedia:
   - **Profil & Hero** — ganti logo, foto latar hero, judul & sub-judul hero, nama yayasan, foto & nama pengasuh, teks sejarah, tahun berdiri.
   - **Program** — tambah/hapus program pendidikan (Pengajian Rutin, Al-Qur'an, Hadis, Tafsir, dll — bebas ditambah kategori baru).
   - **Berita** — tulis, edit, hapus berita lengkap dengan foto, tanggal, ringkasan, dan isi lengkap.
   - **Galeri** — kelola kategori galeri sendiri (misal: Kegiatan Santri, Fasilitas, Acara) lalu upload foto ke tiap kategori.
   - **Kontak** — ubah alamat, query peta, link Instagram/Facebook, nomor WhatsApp.
   - **Akun** — ganti password admin, atau logout.
4. Semua foto otomatis dikompresi ringan sebelum disimpan supaya database tetap ringan & website tetap cepat.

## Catatan Keamanan

- Hanya user yang login lewat Firebase Authentication yang bisa **menulis/mengubah** data (lihat `database.rules.json`).
- Publik (pengunjung situs) hanya bisa **membaca** data — tidak bisa mengedit apa pun tanpa login.
- Jangan bagikan email/password admin ke sembarang orang.

## Fitur
- ✅ Dark / Light mode
- ✅ Hero, profil, sejarah, kontak, sosmed — full editable dari dashboard
- ✅ Program pendidikan — CRUD dari dashboard
- ✅ Berita — CRUD lengkap dengan foto, tanggal, ringkasan & isi
- ✅ Galeri multi-kategori — kategori juga bisa dikelola sendiri dari dashboard
- ✅ Login admin pakai Firebase Authentication (bukan password hardcoded)
- ✅ Ganti password admin langsung dari dashboard
- ✅ Lightbox galeri & modal detail berita
- ✅ Responsive (mobile friendly)
