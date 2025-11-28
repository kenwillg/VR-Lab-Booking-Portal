# PWA Install di Android - Panduan HTTPS

## Masalah

PWA install prompt hanya muncul di **HTTPS** (atau localhost). Saat akses via IP address (seperti `192.168.x.x:4173`), browser tidak menganggapnya sebagai secure context, jadi hanya muncul "Add to Home Screen" biasa, bukan PWA install prompt.

## Solusi

### Opsi 1: Gunakan Localhost (Paling Mudah)

1. **Di komputer:**
   ```bash
   npm run preview -- --host
   ```

2. **Di HP Android:**
   - Pastikan HP dan komputer di WiFi yang sama
   - Buka Chrome di HP
   - Ketik: `http://localhost:4173` atau `http://127.0.0.1:4173`
   - **TIDAK AKAN BEKERJA** karena localhost di HP = HP itu sendiri, bukan komputer

### Opsi 2: Gunakan ngrok (Recommended untuk Testing)

ngrok membuat tunnel HTTPS gratis:

1. **Install ngrok:**
   - Download dari https://ngrok.com/download
   - Atau via npm: `npm install -g ngrok`

2. **Jalankan preview:**
   ```bash
   npm run preview -- --host
   ```

3. **Di terminal baru, jalankan ngrok:**
   ```bash
   ngrok http 4173
   ```

4. **Copy HTTPS URL dari ngrok** (contoh: `https://abc123.ngrok.io`)

5. **Buka URL ngrok di HP Android** - PWA install prompt akan muncul!

### Opsi 3: Setup HTTPS Lokal dengan mkcert

1. **Install mkcert:**
   ```bash
   # Windows (via Chocolatey)
   choco install mkcert
   
   # Atau download dari https://github.com/FiloSottile/mkcert/releases
   ```

2. **Setup local CA:**
   ```bash
   mkcert -install
   ```

3. **Generate certificate:**
   ```bash
   mkcert localhost 127.0.0.1 ::1 192.168.1.x
   # Ganti 192.168.1.x dengan IP komputer Anda
   ```

4. **Update vite.config.ts untuk HTTPS:**
   ```typescript
   server: {
     port: 3000,
     https: {
       key: fs.readFileSync('./localhost-key.pem'),
       cert: fs.readFileSync('./localhost.pem')
     }
   }
   ```

### Opsi 4: Deploy ke Server dengan HTTPS

Deploy ke hosting yang sudah punya HTTPS:
- Vercel (gratis)
- Netlify (gratis)
- Firebase Hosting (gratis)
- GitHub Pages (gratis, perlu setup)

## Testing PWA Install

### Checklist:

- [ ] Akses via HTTPS (atau localhost)
- [ ] Service Worker terdaftar (check di DevTools > Application > Service Workers)
- [ ] Manifest valid (check di DevTools > Application > Manifest)
- [ ] Icons accessible (192x192 dan 512x512)
- [ ] `beforeinstallprompt` event ter-trigger (check console)

### Cara Cek di Chrome DevTools (Mobile):

1. Connect HP ke komputer via USB
2. Buka Chrome di komputer: `chrome://inspect`
3. Pilih device dan tab yang terbuka
4. Check:
   - **Application > Manifest** - Pastikan tidak ada error
   - **Application > Service Workers** - Pastikan service worker active
   - **Console** - Cek apakah `beforeinstallprompt` event muncul

## Manual Install (Jika Prompt Tidak Muncul)

Jika prompt tidak muncul, user masih bisa install manual:

1. **Chrome Android:**
   - Menu (3 dots) → "Add to Home screen" atau "Install app"
   - Ini akan install sebagai PWA jika semua requirements terpenuhi

2. **Samsung Internet:**
   - Menu → "Add page to" → "Home screen"

## Catatan Penting

- **HTTPS wajib** untuk PWA install prompt (kecuali localhost)
- **IP address tidak dianggap secure** oleh browser
- **"Add to Home Screen"** masih install PWA, tapi tanpa prompt otomatis
- **Service Worker harus aktif** untuk PWA berfungsi

## Quick Test dengan ngrok

```bash
# Terminal 1: Start preview
npm run preview -- --host

# Terminal 2: Start ngrok
ngrok http 4173

# Buka URL ngrok di HP (contoh: https://abc123.ngrok.io)
# PWA install prompt akan muncul!
```

