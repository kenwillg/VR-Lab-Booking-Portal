# PWA Setup Guide

Aplikasi ini sudah dikonfigurasi sebagai Progressive Web App (PWA) yang bisa diinstall di Android.

## Fitur PWA

✅ **Installable** - Bisa diinstall di Android seperti aplikasi native
✅ **Offline Support** - Bisa berjalan offline dengan service worker
✅ **App-like Experience** - Tampil seperti aplikasi native (standalone mode)
✅ **Fast Loading** - Caching untuk performa lebih cepat
✅ **Auto Update** - Update otomatis saat ada versi baru

## Cara Install di Android

### Metode 1: Via Browser Chrome

1. Buka aplikasi di Chrome Android
2. Akan muncul popup "Add to Home Screen" atau "Install App"
3. Klik "Install" atau "Add"
4. Aplikasi akan muncul di home screen seperti aplikasi native

### Metode 2: Manual

1. Buka aplikasi di browser Chrome
2. Tap menu (3 dots) di pojok kanan atas
3. Pilih "Add to Home screen" atau "Install app"
4. Konfirmasi dengan tap "Add" atau "Install"

### Metode 3: Via Install Prompt

Aplikasi akan menampilkan prompt install otomatis setelah beberapa detik jika:
- Belum terinstall
- Browser mendukung PWA install
- User belum dismiss prompt tersebut

## Build untuk Production

```bash
# Build aplikasi
npm run build

# File akan ada di folder dist/
# Deploy folder dist/ ke web server (nginx, apache, etc)
```

## Requirements untuk PWA

1. **HTTPS** - PWA harus diakses via HTTPS (kecuali localhost)
2. **Manifest** - Sudah dikonfigurasi di `vite.config.ts`
3. **Service Worker** - Otomatis dibuat oleh vite-plugin-pwa
4. **Icons** - Perlu icon 192x192 dan 512x512 (saat ini menggunakan placeholder)

## Menambahkan Icons

Untuk icon yang lebih baik, ganti file di `public/`:

1. **pwa-192x192.png** - Icon 192x192 pixels
2. **pwa-512x512.png** - Icon 512x512 pixels

Icon harus:
- Format PNG
- Square (1:1 ratio)
- Transparent background (optional)
- High quality

## Testing PWA

### Di Development

```bash
npm run dev
```

Service worker akan aktif di development mode.

### Di Production

```bash
npm run build
npm run preview
```

Atau deploy ke server dengan HTTPS.

## Checklist PWA

- [x] Manifest.json configured
- [x] Service Worker registered
- [x] Icons added (placeholder)
- [x] Install prompt component
- [x] Offline caching strategy
- [x] Theme color set
- [x] Display mode: standalone
- [x] Start URL configured

## Troubleshooting

### Install prompt tidak muncul

- Pastikan menggunakan HTTPS (atau localhost)
- Clear cache browser
- Pastikan service worker terdaftar (check di DevTools > Application > Service Workers)
- Cek di DevTools > Application > Manifest

### Service Worker tidak bekerja

- Check console untuk error
- Pastikan vite-plugin-pwa terinstall
- Restart dev server
- Clear browser cache

### Aplikasi tidak bisa diinstall

- Pastikan semua requirements terpenuhi
- Check manifest.json valid
- Pastikan icons ada dan accessible
- Check di Chrome DevTools > Application > Manifest untuk error

## Deployment

Untuk production, pastikan:

1. **HTTPS enabled** - PWA memerlukan HTTPS
2. **Correct API URL** - Update `VITE_API_URL` di `.env.production`
3. **Build optimized** - Run `npm run build`
4. **Service Worker** - Pastikan service worker terdeploy dengan benar

## Android Specific

- **Chrome** - Full support
- **Samsung Internet** - Full support
- **Firefox** - Limited support
- **Opera** - Full support

## iOS Support

Untuk iOS, tambahkan di `index.html`:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/pwa-192x192.png">
```

Sudah ditambahkan di `index.html`.

