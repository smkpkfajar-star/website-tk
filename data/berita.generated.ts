export type Berita = {
  slug: string
  tanggal: string // ISO YYYY-MM-DD (zona Asia/Jakarta)
  tanggalLabel: string
  judul: string
  ringkasan: string
  kategori: string
  gambar: string
  alt: string
  sumber: string | null
  caption: string
  isVideo: boolean
  videoUrl: string | null
  hashtags: string[]
  likes: number
}

type ApiPost = {
  id: string
  short_code: string
  type: string
  caption: string | null
  hashtags: string[]
  thumbnail_url: string | null
  images: string[]
  is_video: boolean
  video_url: string | null
  post_url: string
  likes: number
  posted_at: string
}

type ApiResponse = {
  status: string
  total: number
  data: ApiPost[]
}

const API_URL =
  process.env.BERITA_API_URL ??
  'https://api-ig-ruddy.vercel.app/api/berita/sekolah/tamanindriajetis'

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function isoWIB(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
}

function fmtTanggal(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${BULAN[m - 1]} ${y}`
}

function bersihkanBaris(s: string) {
  return s
    .replace(/https?:\/\/\S+/g, '')
    .replace(/@\w[\w.]*/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, sp, ch) => sp + ch.toUpperCase())
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

function potong(s: string, max: number) {
  if (s.length <= max) return s
  const p = s.slice(0, max).replace(/\s+\S*$/, '')
  return p.replace(/[.,;:!\s]+$/, '') + '…'
}

function bagiCaption(caption: string) {
  const baris = caption
    .split('\n')
    .map(bersihkanBaris)
    .filter((b) => b && !/^[.\s]+$/.test(b))

  let idx = baris.findIndex((b) => b.length >= 12 && !/^salam\b/i.test(b))
  if (idx === -1) idx = 0

  let judul = baris[idx] ?? 'Berita Sekolah'
  judul = judul.replace(/[!.:\s]+$/, '')
  if (judul === judul.toUpperCase()) judul = titleCase(judul)

  const sisa = baris.filter((_, i) => i !== idx).join(' ')
  return { judul: potong(judul, 90), ringkasan: potong(sisa || judul, 220) }
}

function tentukanKategori(teks: string) {
  const t = teks.toLowerCase()
  if (/(juara|prestasi|lomba|kejuaraan|selamat dan sukses)/.test(t)) return 'Prestasi'
  if (/(asesmen|pelatihan|pembelajaran|belajar|kokurikuler|kombel)/.test(t)) return 'Akademik'
  return 'Kegiatan'
}

function petakan(p: ApiPost): Berita {
  const caption = p.caption ?? ''
  const { judul, ringkasan } = bagiCaption(caption)
  const tanggal = isoWIB(p.posted_at)

  return {
    slug: `${slugify(judul)}-${p.short_code.toLowerCase()}`,
    tanggal,
    tanggalLabel: fmtTanggal(tanggal),
    judul,
    ringkasan,
    kategori: tentukanKategori(caption),
    gambar: p.images?.[0] ?? p.thumbnail_url ?? '',
    alt: judul,
    sumber: p.post_url ?? null,
    caption,
    isVideo: p.is_video,
    videoUrl: p.video_url,
    hashtags: p.hashtags ?? [],
    likes: p.likes ?? 0,
  }
}

export async function getBerita(): Promise<Berita[]> {
  const res = await fetch(API_URL, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Gagal memuat berita (${res.status})`)

  const json: ApiResponse = await res.json()
  if (json.status !== 'success' || !Array.isArray(json.data)) {
    throw new Error('Format respons API tidak sesuai')
  }

  return json.data.map(petakan).sort((a, b) => b.tanggal.localeCompare(a.tanggal))
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  const semua = await getBerita()
  return semua.find((b) => b.slug === slug) ?? null
}

// Kompatibilitas: file lain yang masih `import { berita }` tetap jalan.
// Catatan: nilainya hanya dihitung sekali saat server start/build.
export const berita: Berita[] = await getBerita().catch(() => [])