/* =========================================================
   AN-NIDHOMIYAH — main.js
   UI, rendering dari Firebase, dan logika dashboard admin
   ========================================================= */

document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ===== DEFAULT CONTENT (fallback sebelum admin mengisi data) ===== */
const DEFAULTS = {
  orgName: "Yayasan Pondok Pesantren An-Nidhomiyah",
  heroTitle: "Yayasan Pondok Pesantren<br>An-Nidhomiyah",
  heroSub: "Melanjutkan perjuangan menebar ilmu dan membina umat, di bawah asuhan KH. Badrus Sholeh Syakur.",
  founderName: "KH. Badrus Sholeh Syakur",
  aboutText: `Yayasan Pondok Pesantren An-Nidhomiyah dibentuk pada 20 Februari 1988, di bawah kepemimpinan KH. Badrus Sholeh Syakur. Beliau meneruskan perjuangan para pendahulu yang telah melaksanakan pendidikan keagamaan kepada masyarakat.

Sebagai seorang pendidik, beliau bersama keluarga membentuk yayasan pondok pesantren untuk memberikan sumbangsih pendidikan terhadap masyarakat sekitar — mulai dari pengajian rutin, pendidikan Al-Qur'an, pengajian hadis, tafsir, dan lain-lainnya.`,
  yearFounded: "1988",
  yearsActive: "37+",
  address: "Jl. Raya Ngelom No.179, Ngelom, Kec. Taman, Kabupaten Sidoarjo, Jawa Timur 61257",
  mapQuery: "Jl. Raya Ngelom No.179, Sidoarjo",
  instagram: "https://www.instagram.com/ponpes.annidhomiyah/",
  facebook: "https://www.facebook.com/ponpes.annidhomiyah/",
  whatsapp: "",
  logo: "images/logo-placeholder.svg",
  heroBg: "images/hero-placeholder.svg",
  founderPhoto: "images/founder-placeholder.svg"
};

const DEFAULT_PROGRAMS = [
  { title: "Pengajian Rutin", desc: "Kajian rutin bersama pengasuh untuk santri dan masyarakat sekitar.", icon: "fa-solid fa-people-group" },
  { title: "Pendidikan Al-Qur'an", desc: "Bimbingan membaca, menghafal, dan memahami Al-Qur'an.", icon: "fa-solid fa-book-quran" },
  { title: "Pengajian Hadis", desc: "Pendalaman hadis-hadis Nabi ﷺ sebagai pedoman kehidupan.", icon: "fa-solid fa-book" },
  { title: "Tafsir", desc: "Kajian tafsir Al-Qur'an untuk memperdalam pemahaman keagamaan.", icon: "fa-solid fa-scroll" }
];

const DEFAULT_CATEGORIES = ["Kegiatan Santri", "Fasilitas", "Acara"];

let currentSettings = { ...DEFAULTS };

/* ===== THEME TOGGLE ===== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('theme', t);
}
applyTheme(localStorage.getItem('theme') || 'light');
themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
document.getElementById('mobileClose').addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== TOAST ===== */
function toast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

/* ===== FILE -> BASE64 HELPER (dengan kompresi ringan) ===== */
function fileToCompressedBase64(file, maxWidth = 1280, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindFileDrop(dropId, inputId, previewId, textId, onFile) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const text = document.getElementById(textId);
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    const b64 = await fileToCompressedBase64(file);
    preview.src = b64;
    preview.style.display = 'block';
    text.style.display = 'none';
    onFile(b64);
  });
}

/* =========================================================
   RENDER: HERO / ABOUT / CONTACT (dari settings)
   ========================================================= */
function renderSettings(s) {
  currentSettings = { ...DEFAULTS, ...s };
  const c = currentSettings;

  document.getElementById('pageTitle').textContent = c.orgName;
  document.getElementById('navLogo').src = c.logo;
  document.getElementById('heroBg').style.backgroundImage = `url('${c.heroBg}')`;
  document.getElementById('heroTitle').innerHTML = c.heroTitle;
  document.getElementById('heroSub').textContent = c.heroSub;
  document.getElementById('founderPhoto').src = c.founderPhoto;
  document.getElementById('founderName').textContent = c.founderName;
  document.getElementById('aboutText').textContent = c.aboutText;
  document.getElementById('statYears').textContent = c.yearsActive;
  document.getElementById('contactAddress').textContent = c.address;
  document.getElementById('contactIg').href = c.instagram;
  document.getElementById('contactIg').textContent = c.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '');
  document.getElementById('contactFb').href = c.facebook;
  document.getElementById('contactFb').textContent = c.facebook.replace(/https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '');
  document.getElementById('contactMapFrame').src = `https://maps.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const socials = document.getElementById('contactSocials');
  socials.innerHTML = `
    <a href="${c.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
    <a href="${c.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>
    ${c.whatsapp ? `<a href="https://wa.me/${c.whatsapp}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
  `;

  // isi form admin profil supaya sinkron
  document.getElementById('fHeroTitle').value = c.heroTitle.replace(/<br\s*\/?>/gi, '\n');
  document.getElementById('fHeroSub').value = c.heroSub;
  document.getElementById('fOrgName').value = c.orgName;
  document.getElementById('fFounderName').value = c.founderName;
  document.getElementById('fAboutText').value = c.aboutText;
  document.getElementById('fYearFounded').value = c.yearFounded;
  document.getElementById('fYearsActive').value = c.yearsActive;
  document.getElementById('cAddress').value = c.address;
  document.getElementById('cMapQuery').value = c.mapQuery;
  document.getElementById('cIg').value = c.instagram;
  document.getElementById('cFb').value = c.facebook;
  document.getElementById('cWa').value = c.whatsapp;
  if (c.logo !== DEFAULTS.logo) { document.getElementById('logoPreview').src = c.logo; document.getElementById('logoPreview').style.display = 'block'; document.getElementById('logoDropText').style.display = 'none'; }
  if (c.heroBg !== DEFAULTS.heroBg) { document.getElementById('heroPreview').src = c.heroBg; document.getElementById('heroPreview').style.display = 'block'; document.getElementById('heroDropText').style.display = 'none'; }
  if (c.founderPhoto !== DEFAULTS.founderPhoto) { document.getElementById('founderPreview').src = c.founderPhoto; document.getElementById('founderPreview').style.display = 'block'; document.getElementById('founderDropText').style.display = 'none'; }
}

/* Tunggu firebase.js siap lalu subscribe */
function waitForFirebase(cb) {
  if (window.__fbReady) return cb();
  setTimeout(() => waitForFirebase(cb), 60);
}
waitForFirebase(() => {
  window.fbGetSettings(renderSettings);
  window.fbFetchPrograms(renderPrograms);
  window.fbFetchNews(renderNews);
  window.fbFetchCategories(onCategories);
  window.fbFetchGallery(onGalleryData);
  window.fbOnAuthChange(onAuthState);
});

/* =========================================================
   PROGRAM
   ========================================================= */
let programsCache = [];
function renderPrograms(list) {
  programsCache = list;
  const grid = document.getElementById('programGrid');
  const items = list.length ? list : DEFAULT_PROGRAMS;
  grid.innerHTML = items.map(p => `
    <div class="program-card">
      <i class="${p.icon || 'fa-solid fa-book'}"></i>
      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.desc)}</p>
    </div>
  `).join('');

  const manageList = document.getElementById('programList');
  manageList.innerHTML = list.length ? list.map(p => `
    <div class="admin-list-item">
      <i class="${p.icon || 'fa-solid fa-book'}" style="width:32px;text-align:center;color:var(--accent);"></i>
      <div class="admin-list-info"><strong>${escapeHtml(p.title)}</strong><span>${escapeHtml(p.desc)}</span></div>
      <div class="admin-list-actions"><div class="icon-btn danger" data-del-program="${p.id}"><i class="fa-solid fa-trash"></i></div></div>
    </div>
  `).join('') : `<p style="color:var(--text3); font-size:0.85rem;">Belum ada program tersimpan. Tampilan depan memakai data contoh — tambahkan program nyata di sini.</p>`;

  manageList.querySelectorAll('[data-del-program]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Hapus program ini?')) window.fbDeleteProgram(btn.dataset.delProgram).then(() => toast('Program dihapus'));
    });
  });
}

/* =========================================================
   BERITA
   ========================================================= */
let newsCache = [];
function renderNews(list) {
  newsCache = list;
  const grid = document.getElementById('newsGrid');
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">Belum ada berita. Berita terbaru akan tampil di sini setelah ditambahkan lewat dashboard admin.</div>`;
  } else {
    grid.innerHTML = list.map(n => `
      <div class="news-card" data-news-id="${n.id}">
        <img class="news-card-img" src="${n.image || 'images/hero-placeholder.svg'}" alt="${escapeHtml(n.title)}" />
        <div class="news-card-body">
          <span class="news-date">${formatDate(n.date)}</span>
          <h4>${escapeHtml(n.title)}</h4>
          <p>${escapeHtml(n.excerpt || '')}</p>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('[data-news-id]').forEach(card => {
      card.addEventListener('click', () => openNewsModal(card.dataset.newsId));
    });
  }

  const manageList = document.getElementById('newsList');
  manageList.innerHTML = list.length ? list.map(n => `
    <div class="admin-list-item">
      <img class="admin-list-thumb" src="${n.image || 'images/hero-placeholder.svg'}" />
      <div class="admin-list-info"><strong>${escapeHtml(n.title)}</strong><span>${formatDate(n.date)}</span></div>
      <div class="admin-list-actions">
        <div class="icon-btn" data-edit-news="${n.id}"><i class="fa-solid fa-pen"></i></div>
        <div class="icon-btn danger" data-del-news="${n.id}"><i class="fa-solid fa-trash"></i></div>
      </div>
    </div>
  `).join('') : `<p style="color:var(--text3); font-size:0.85rem;">Belum ada berita.</p>`;

  manageList.querySelectorAll('[data-del-news]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Hapus berita ini?')) window.fbDeleteNews(btn.dataset.delNews).then(() => toast('Berita dihapus'));
    });
  });
  manageList.querySelectorAll('[data-edit-news]').forEach(btn => {
    btn.addEventListener('click', () => loadNewsToForm(btn.dataset.editNews));
  });
}

function openNewsModal(id) {
  const n = newsCache.find(x => x.id === id);
  if (!n) return;
  document.getElementById('newsModalImg').src = n.image || 'images/hero-placeholder.svg';
  document.getElementById('newsModalDate').textContent = formatDate(n.date);
  document.getElementById('newsModalTitle').textContent = n.title;
  document.getElementById('newsModalContent').textContent = n.content || n.excerpt || '';
  document.getElementById('newsModal').classList.remove('hidden');
}
document.getElementById('newsModalClose').addEventListener('click', () => document.getElementById('newsModal').classList.add('hidden'));
document.getElementById('newsModal').addEventListener('click', (e) => { if (e.target.id === 'newsModal') e.currentTarget.classList.add('hidden'); });

function loadNewsToForm(id) {
  const n = newsCache.find(x => x.id === id);
  if (!n) return;
  document.getElementById('nEditId').value = n.id;
  document.getElementById('nTitle').value = n.title;
  document.getElementById('nDate').value = n.date || '';
  document.getElementById('nExcerpt').value = n.excerpt || '';
  document.getElementById('nContent').value = n.content || '';
  if (n.image) {
    document.getElementById('newsPreview').src = n.image;
    document.getElementById('newsPreview').style.display = 'block';
    document.getElementById('newsDropText').style.display = 'none';
    pendingNewsImage = n.image;
  }
  document.getElementById('newsFormTitle').textContent = 'Edit Berita';
  document.getElementById('saveNewsBtn').innerHTML = '<i class="fa-solid fa-check"></i> Simpan Perubahan';
  document.getElementById('cancelNewsEditBtn').style.display = 'block';
  switchAdminTab('berita');
}

/* =========================================================
   GALLERY
   ========================================================= */
let categoriesCache = [];
let galleryCache = [];
let activeTab = null;

function onCategories(list) {
  categoriesCache = list;
  const names = list.length ? list.map(c => c.name) : DEFAULT_CATEGORIES;
  if (!activeTab) activeTab = names[0];

  const tabsWrap = document.getElementById('galleryTabs');
  tabsWrap.innerHTML = names.map(name => `<div class="gallery-tab ${name === activeTab ? 'active' : ''}" data-tab="${escapeHtml(name)}">${escapeHtml(name)}</div>`).join('');
  tabsWrap.querySelectorAll('.gallery-tab').forEach(t => {
    t.addEventListener('click', () => { activeTab = t.dataset.tab; onCategories(categoriesCache); renderGalleryGrid(); });
  });

  const select = document.getElementById('gCatSelect');
  select.innerHTML = names.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');

  const catList = document.getElementById('catList');
  catList.innerHTML = list.length ? list.map(c => `
    <div class="admin-list-item">
      <div class="admin-list-info"><strong>${escapeHtml(c.name)}</strong></div>
      <div class="admin-list-actions"><div class="icon-btn danger" data-del-cat="${c.id}"><i class="fa-solid fa-trash"></i></div></div>
    </div>
  `).join('') : `<p style="color:var(--text3); font-size:0.85rem;">Memakai kategori contoh: ${DEFAULT_CATEGORIES.join(', ')}. Tambahkan kategori nyata di atas.</p>`;
  catList.querySelectorAll('[data-del-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Hapus kategori ini? Foto di kategori ini tidak ikut terhapus.')) window.fbDeleteCategory(btn.dataset.delCat).then(() => toast('Kategori dihapus'));
    });
  });

  renderGalleryGrid();
}

function onGalleryData(list) {
  galleryCache = list;
  renderGalleryGrid();
  renderGalleryManageList();
}

let lightboxItems = [];
let lightboxIndex = 0;
function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!activeTab) return;
  const items = galleryCache.filter(g => g.category === activeTab);
  lightboxItems = items;
  if (!items.length) {
    grid.innerHTML = `<div class="gallery-loading">Belum ada foto di kategori "${escapeHtml(activeTab)}".</div>`;
    return;
  }
  grid.innerHTML = items.map((it, i) => `
    <div class="gallery-item" data-idx="${i}">
      <img src="${it.url}" alt="${escapeHtml(it.title || '')}" />
      <div class="gallery-overlay"><h5>${escapeHtml(it.title || '')}</h5></div>
    </div>
  `).join('');
  grid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(parseInt(el.dataset.idx)));
  });
}

function openLightbox(idx) {
  lightboxIndex = idx;
  document.getElementById('lightboxImg').src = lightboxItems[idx].url;
  document.getElementById('lightbox').classList.remove('hidden');
}
function navigateLightbox(dir) {
  if (!lightboxItems.length) return;
  lightboxIndex = dir === 'next' ? (lightboxIndex + 1) % lightboxItems.length : (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  document.getElementById('lightboxImg').src = lightboxItems[lightboxIndex].url;
}
document.getElementById('lightboxClose').addEventListener('click', () => document.getElementById('lightbox').classList.add('hidden'));
document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox('prev'));
document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox('next'));
document.getElementById('lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') e.currentTarget.classList.add('hidden'); });

function renderGalleryManageList() {
  const wrap = document.getElementById('galleryManageList');
  wrap.innerHTML = galleryCache.length ? galleryCache.map(it => `
    <div class="admin-list-item">
      <img class="admin-list-thumb" src="${it.url}" />
      <div class="admin-list-info"><strong>${escapeHtml(it.title || '(tanpa judul)')}</strong><span>${escapeHtml(it.category)}</span></div>
      <div class="admin-list-actions"><div class="icon-btn danger" data-del-photo="${it.id}"><i class="fa-solid fa-trash"></i></div></div>
    </div>
  `).join('') : `<p style="color:var(--text3); font-size:0.85rem;">Belum ada foto.</p>`;
  wrap.querySelectorAll('[data-del-photo]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Hapus foto ini?')) window.fbDeleteGalleryPhoto(btn.dataset.delPhoto).then(() => toast('Foto dihapus'));
    });
  });
}

/* =========================================================
   UTIL
   ========================================================= */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* =========================================================
   ADMIN PANEL: open/close, login, tabs
   ========================================================= */
const adminOverlay = document.getElementById('adminOverlay');
document.getElementById('adminFab').addEventListener('click', () => adminOverlay.classList.remove('hidden'));
document.getElementById('adminClose').addEventListener('click', () => adminOverlay.classList.add('hidden'));

function onAuthState(user) {
  const loginBox = document.getElementById('adminLoginBox');
  const dash = document.getElementById('adminDashboard');
  if (user) {
    loginBox.style.display = 'none';
    dash.style.display = 'block';
  } else {
    loginBox.style.display = 'flex';
    dash.style.display = 'none';
  }
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  try {
    await window.fbLogin(email, pass);
    toast('Berhasil masuk');
  } catch (e) {
    errEl.textContent = 'Login gagal: email atau password salah.';
    errEl.style.display = 'block';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  window.fbLogout().then(() => { adminOverlay.classList.add('hidden'); toast('Berhasil keluar'); });
});

document.getElementById('changePasswordBtn').addEventListener('click', async () => {
  const pw = document.getElementById('newPassword').value;
  if (pw.length < 6) return toast('Password minimal 6 karakter');
  try {
    await window.fbChangePassword(pw);
    document.getElementById('newPassword').value = '';
    toast('Password berhasil diubah');
  } catch (e) {
    toast('Gagal ubah password — coba login ulang lalu ulangi.');
  }
});

/* Tabs */
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
}
document.querySelectorAll('.admin-tab').forEach(t => t.addEventListener('click', () => switchAdminTab(t.dataset.tab)));

/* ===== File drops binding ===== */
let pendingLogo = null, pendingHeroBg = null, pendingFounder = null, pendingNewsImage = null, pendingGalleryImage = null;
bindFileDrop('logoDrop', 'logoInput', 'logoPreview', 'logoDropText', (b64) => pendingLogo = b64);
bindFileDrop('heroDrop', 'heroInput', 'heroPreview', 'heroDropText', (b64) => pendingHeroBg = b64);
bindFileDrop('founderDrop', 'founderInput', 'founderPreview', 'founderDropText', (b64) => pendingFounder = b64);
bindFileDrop('newsDrop', 'newsInput', 'newsPreview', 'newsDropText', (b64) => pendingNewsImage = b64);
bindFileDrop('galleryDrop', 'galleryInput', 'galleryPreview', 'galleryDropText', (b64) => pendingGalleryImage = b64);

/* ===== SAVE: Profil & Hero ===== */
document.getElementById('saveProfilBtn').addEventListener('click', () => {
  const payload = {
    orgName: document.getElementById('fOrgName').value.trim(),
    heroTitle: document.getElementById('fHeroTitle').value.trim().replace(/\n/g, '<br>'),
    heroSub: document.getElementById('fHeroSub').value.trim(),
    founderName: document.getElementById('fFounderName').value.trim(),
    aboutText: document.getElementById('fAboutText').value.trim(),
    yearFounded: document.getElementById('fYearFounded').value.trim(),
    yearsActive: document.getElementById('fYearsActive').value.trim(),
  };
  if (pendingLogo) payload.logo = pendingLogo;
  if (pendingHeroBg) payload.heroBg = pendingHeroBg;
  if (pendingFounder) payload.founderPhoto = pendingFounder;
  window.fbSaveSettings(payload).then(() => toast('Profil tersimpan')).catch(() => toast('Gagal menyimpan — pastikan sudah login'));
});

/* ===== SAVE: Kontak ===== */
document.getElementById('saveContactBtn').addEventListener('click', () => {
  const payload = {
    address: document.getElementById('cAddress').value.trim(),
    mapQuery: document.getElementById('cMapQuery').value.trim(),
    instagram: document.getElementById('cIg').value.trim(),
    facebook: document.getElementById('cFb').value.trim(),
    whatsapp: document.getElementById('cWa').value.trim(),
  };
  window.fbSaveSettings(payload).then(() => toast('Kontak tersimpan')).catch(() => toast('Gagal menyimpan — pastikan sudah login'));
});

/* ===== PROGRAM: add ===== */
document.getElementById('addProgramBtn').addEventListener('click', () => {
  const title = document.getElementById('pTitle').value.trim();
  const desc = document.getElementById('pDesc').value.trim();
  const icon = document.getElementById('pIcon').value;
  if (!title) return toast('Nama program wajib diisi');
  window.fbAddProgram({ title, desc, icon }).then(() => {
    document.getElementById('pTitle').value = '';
    document.getElementById('pDesc').value = '';
    toast('Program ditambahkan');
  }).catch(() => toast('Gagal — pastikan sudah login'));
});

/* ===== BERITA: save (add/edit) ===== */
document.getElementById('saveNewsBtn').addEventListener('click', () => {
  const id = document.getElementById('nEditId').value;
  const payload = {
    title: document.getElementById('nTitle').value.trim(),
    date: document.getElementById('nDate').value,
    excerpt: document.getElementById('nExcerpt').value.trim(),
    content: document.getElementById('nContent').value.trim(),
  };
  if (!payload.title) return toast('Judul berita wajib diisi');
  if (pendingNewsImage) payload.image = pendingNewsImage;

  const action = id ? window.fbUpdateNews(id, payload) : window.fbAddNews(payload);
  action.then(() => {
    resetNewsForm();
    toast(id ? 'Berita diperbarui' : 'Berita dipublikasikan');
  }).catch(() => toast('Gagal — pastikan sudah login'));
});
document.getElementById('cancelNewsEditBtn').addEventListener('click', resetNewsForm);
function resetNewsForm() {
  document.getElementById('nEditId').value = '';
  document.getElementById('nTitle').value = '';
  document.getElementById('nDate').value = '';
  document.getElementById('nExcerpt').value = '';
  document.getElementById('nContent').value = '';
  document.getElementById('newsPreview').style.display = 'none';
  document.getElementById('newsDropText').style.display = 'block';
  pendingNewsImage = null;
  document.getElementById('newsFormTitle').textContent = 'Tambah Berita';
  document.getElementById('saveNewsBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Publikasikan Berita';
  document.getElementById('cancelNewsEditBtn').style.display = 'none';
}

/* ===== GALERI: kategori & foto ===== */
document.getElementById('addCatBtn').addEventListener('click', () => {
  const name = document.getElementById('gCatName').value.trim();
  if (!name) return toast('Nama kategori wajib diisi');
  window.fbAddCategory(name).then(() => { document.getElementById('gCatName').value = ''; toast('Kategori ditambahkan'); }).catch(() => toast('Gagal — pastikan sudah login'));
});
document.getElementById('addPhotoBtn').addEventListener('click', () => {
  const category = document.getElementById('gCatSelect').value;
  const title = document.getElementById('gTitle').value.trim();
  if (!pendingGalleryImage) return toast('Pilih foto terlebih dahulu');
  window.fbAddGalleryPhoto({ category, title, url: pendingGalleryImage }).then(() => {
    document.getElementById('gTitle').value = '';
    document.getElementById('galleryPreview').style.display = 'none';
    document.getElementById('galleryDropText').style.display = 'block';
    pendingGalleryImage = null;
    toast('Foto ditambahkan');
  }).catch(() => toast('Gagal — pastikan sudah login'));
});
