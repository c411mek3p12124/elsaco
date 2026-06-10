# Elsa & Co — Landing Page

Landing page scrollytelling + glassmorphic untuk Elsa (Virtual Assistant, Bali), dengan
**editor privat** agar Elsa bisa mengubah teks, gambar, dan video sendiri.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

- Situs: http://localhost:3000 (atau port lain bila diset `PORT`)
- Editor privat: http://localhost:3000/admin

## Editor privat (`/admin`)

- Password ada di `.env.local` → `ADMIN_PASSWORD` (default: `elsa2026`).
- Buka tiap section, edit teks, upload gambar/video, lalu klik **Simpan**.
- Perubahan tersimpan ke `data/content.json` dan **langsung tampil ke semua pengunjung**.
- File yang diupload masuk ke `public/uploads/`.
- Halaman `/admin` di-set `noindex` (tidak muncul di Google).

## Struktur

- `lib/content.ts` — model konten + teks default (dari ElsaCo-Struktur.docx)
- `lib/store.ts` — baca/tulis konten & upload (lokal: filesystem)
- `app/page.tsx` — landing page (server, baca konten terbaru tiap request)
- `app/admin/` — editor privat
- `components/` — hero image-sequence + semua section
- `public/sequence/` — frame animasi hero

## Deploy ke Vercel — GitHub commit-on-save (tanpa database)

Filesystem Vercel **read-only**, jadi penyimpanan produksi memakai **git-based CMS**:
saat Elsa klik Simpan, editor meng-commit `data/content.json` (dan file upload ke
`public/uploads/`) langsung ke repo GitHub lewat Contents API → Vercel auto-redeploy →
perubahan live (±1 menit). Mengubah "code asli", gratis, tanpa Supabase.

Langkah:
1. Push folder `elsaco` ke sebuah repo GitHub.
2. Import repo itu ke Vercel.
3. Di Vercel → Settings → Environment Variables, isi:
   - `ADMIN_PASSWORD` — password editor
   - `GITHUB_TOKEN` — fine-grained PAT, izin **Contents: Read and write** untuk repo tsb
   - `GITHUB_REPO` — `owner/repo` (mis. `callmekeprra/elsaco`)
   - `GITHUB_BRANCH` — `main`
4. Deploy. Buka `https://situs/admin`, edit, Simpan → otomatis commit + redeploy.

Kalau env GitHub kosong (mis. di localhost), editor otomatis memakai mode file lokal
(menulis langsung ke `data/content.json`) — tinggal `git push` manual bila mau.

> Catatan: gambar OK untuk di-commit; **video besar** kurang cocok (batas file GitHub
> 100MB & repo membengkak) — sebaiknya video kecil atau pakai link/embed YouTube.
