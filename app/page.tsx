import Image from "next/image";
import Link from "next/link";
import { BingkaiBalok } from "@/components/bingkai-balok";
import { JudulSeksi } from "@/components/judul-seksi";
import { KontenSementara } from "@/components/konten-sementara";
import { PlaceholderFoto } from "@/components/placeholder-foto";
import { kelompok } from "@/data/kelas";
import { elemenCapaian, metode } from "@/data/metode";
import { berita } from "@/data/berita.generated";
import { alamatPendek, linkWa, ppdbMulai, ppdbSelesai, site, tahunPpdb } from "@/data/site";

export default function Beranda() {
  return (
    <>
      <Hero />
      <Statistik />
      <MetodeRingkas />
      <KelompokRingkas />
      <KegiatanRingkas />
      <BeritaRingkas />
      <AjakanPpdb />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-hijau-900 bg-kertas-50">
      <div
        aria-hidden="true"
        className="pola-titik absolute inset-0 text-hijau-200 opacity-40"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-hijau-900 bg-hijau-100 px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-hijau-900 uppercase">
            {site.institusi}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-extrabold text-balance text-hijau-900 sm:text-5xl lg:text-6xl">
            {site.nama}
            <span className="mt-2 block text-kunyit-600">{site.tagline}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-balance">
            Sekolah taman kanak-kanak di {alamatPendek} yang
            mengajar dengan cara Taman Indria: anak bermain, pamong
            mengiringi, dan setiap langkah kecil dicatat.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ppdb"
              className="rounded-2xl bg-kunyit-500 px-7 py-3.5 text-center font-display text-base font-bold text-hijau-900 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-kunyit-400"
            >
              Daftar PPDB {tahunPpdb}
            </Link>
            <Link
              href="/metode"
              className="rounded-2xl border-[3px] border-hijau-900 bg-white px-7 py-3.5 text-center font-display text-base font-bold text-hijau-900 transition-colors duration-200 hover:bg-hijau-100"
            >
              Lihat Metode Belajar
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-soft">
            Pendaftaran {ppdbMulai} sampai {ppdbSelesai}
          </p>
        </div>

        <BingkaiBalok warna="kunyit" miring={-5}>
          <PlaceholderFoto
            label="Foto TK"
            warna="kunyit"
            aspect="aspect-4/3"
            className="border-0"
          />
        </BingkaiBalok>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STATISTIK = [
  { angka: "3", label: "Kelompok belajar", warna: "bg-hijau-600" },
  { angka: "38", label: "Anak aktif", warna: "bg-kunyit-500" },
  { angka: "5", label: "Pendidik", warna: "bg-hijau-500" },
  { angka: "1", label: "Halaman bermain", warna: "bg-hijau-800" },
];

function Statistik() {
  return (
    <section aria-label="Angka ringkas" className="border-b-4 border-hijau-900 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-hijau-900 px-0 lg:grid-cols-4">
        {STATISTIK.map((s) => (
          <div key={s.label} className={`${s.warna} px-4 py-7 text-center`}>
            <p className="font-display text-4xl font-extrabold text-white">
              {s.angka}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/90">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function MetodeRingkas() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <JudulSeksi
        label="Cara kami mengajar"
        judul="Anak belajar, bukan diberi tahu"
        deskripsi="Empat cara kerja Taman Indria yang kami pakai setiap hari di kelas."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metode.slice(0, 4).map((m) => (
          <article
            key={m.id}
            className={`rounded-[1.75rem] border-4 p-6 transition-transform duration-200 hover:-translate-y-1 ${GAYA[m.warna]}`}
          >
            <h3 className="font-display text-xl font-extrabold text-hijau-900">
              {m.nama}
            </h3>
            <p className="mt-2 text-sm font-bold text-hijau-700">{m.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink">{m.ringkas}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/metode"
          className="inline-block rounded-2xl border-[3px] border-hijau-900 px-6 py-3 font-display font-bold text-hijau-900 transition-colors duration-200 hover:bg-hijau-100"
        >
          Baca penjelasan lengkap
        </Link>
      </div>
    </section>
  );
}

const GAYA = {
  hijau: "border-hijau-600 bg-hijau-50",
  kunyit: "border-kunyit-500 bg-kunyit-50",
  daun: "border-hijau-400 bg-hijau-100",
} as const;

/* ------------------------------------------------------------------ */

function KelompokRingkas() {
  return (
    <section className="border-y-4 border-hijau-900 bg-kertas-100">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <JudulSeksi
          label="Kelompok belajar"
          judul="Tiga kelompok, satu cara bermain"
          deskripsi="Setiap kelompok punya fokus yang berbeda, tetapi semuanya belajar dengan bermain."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {kelompok.map((k) => (
            <KontenSementara key={k.id} className="h-full">
              <article
                className={`h-full rounded-[1.75rem] border-4 ${GAYA[k.warna]} p-6`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-extrabold text-hijau-900">
                    {k.nama}
                  </h3>
                  <span className="text-xs font-bold text-ink-soft">
                    {k.usia}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{k.fokus}</p>
                <ul className="mt-4 space-y-1.5">
                  {k.kegiatanUtama.map((g) => (
                    <li
                      key={g}
                      className="flex items-start gap-2 text-sm text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-hijau-600"
                      />
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t-2 border-hijau-900/10 pt-4 text-xs font-semibold text-ink-soft">
                  {k.jumlahAnak} anak - {k.jumlahGuru} pamong
                </p>
              </article>
            </KontenSementara>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function KegiatanRingkas() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <JudulSeksi
            label="Sehari di TK"
            judul="Anak punya waktu untuk main, bukan untuk menghafal"
            deskripsi="Jadwal hariannya disusun agar anak bergantian antara bergerak, bermain, beristirahat, dan makan."
          />
          <ul className="mt-8 space-y-3">
            {elemenCapaian.map((e) => (
              <li
                key={e.nama}
                className="flex items-start gap-4 rounded-2xl border-2 border-hijau-200 bg-white p-4"
              >
                <span
                  aria-hidden="true"
                  className={`mt-1 h-10 w-3 shrink-0 rounded-full ${GAYA[e.warna].split(" ")[1]}`}
                />
                <div>
                  <p className="font-display text-base font-bold text-hijau-900">
                    {e.nama}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">{e.ringkas}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-16">
          <JadwalSingkat />
        </div>
      </div>
    </section>
  );
}

function JadwalSingkat() {
  const jam = [
    ["07.30", "Penyambutan"],
    ["08.00", "Makan pagi sendiri"],
    ["09.00", "Dolanan anak"],
    ["10.30", "Kokurikuler"],
    ["11.15", "Manungsi"],
    ["12.00", "Makan siang"],
  ];
  return (
    <div className="rounded-[2rem] border-4 border-hijau-900 bg-white p-6">
      <h3 className="font-display text-xl font-extrabold text-hijau-900">
        Potongan jadwal
      </h3>
      <ol className="mt-5 space-y-0">
        {jam.map(([waktu, kegiatan], i) => (
          <li key={waktu} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-hijau-100 font-display text-xs font-bold text-hijau-900">
                {waktu}
              </span>
              {i < jam.length - 1 ? (
                <span aria-hidden="true" className="w-0.5 flex-1 bg-hijau-200" />
              ) : null}
            </div>
            <p className="pt-2.5 text-sm font-semibold text-ink">{kegiatan}</p>
          </li>
        ))}
      </ol>
      <Link
        href="/kegiatan"
        className="mt-6 inline-block text-sm font-bold text-hijau-700 underline underline-offset-4 hover:text-hijau-900"
      >
        Lihat jadwal lengkap
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function BeritaRingkas() {
  const terbaru = berita.slice(0, 3);
  if (terbaru.length === 0) return null;

  return (
    <section className="border-y-4 border-hijau-900 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <KontenSementara>
          <JudulSeksi
            label="Kabar terbaru"
            judul="Dokumentasi kegiatan"
            deskripsi="Catatan kegiatan sekolah dari Instagram."
            align="center"
          />
        </KontenSementara>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {terbaru.map((b) => (
            <KontenSementara key={b.slug}>
              <article className="group h-full overflow-hidden rounded-[1.75rem] border-4 border-hijau-900 bg-white transition-transform duration-200 hover:-translate-y-1">
                <div className="relative aspect-4/3 bg-kertas-200">
                  {b.gambar ? (
                    <Image
                      src={b.gambar}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold tracking-wide text-hijau-700 uppercase">
                    {b.kategori} - {b.tanggal}
                  </p>
                  <h3 className="mt-2 font-display text-lg leading-snug font-bold text-hijau-900">
                    <Link href={`/berita/${b.slug}`} className="hover:underline">
                      {b.judul}
                    </Link>
                  </h3>
                </div>
              </article>
            </KontenSementara>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function AjakanPpdb() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <BingkaiBalok warna="hijau" miring={3} className="mx-auto max-w-3xl">
        <div className="bg-hijau-900 p-8 text-center sm:p-12">
          <p className="inline-block rounded-full bg-kunyit-400 px-4 py-1 text-xs font-bold tracking-wider text-hijau-900 uppercase">
            PPDB {tahunPpdb}
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-balance text-white sm:text-4xl">
            Anak Anda sudah siap bermain dan belajar bersama kami.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-hijau-100">
            Pendaftaran {ppdbMulai} sampai {ppdbSelesai}. Tidak ada
            tes akademis. Hanya perkenalan dan observasi saat anak
            bermain.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/ppdb"
              className="rounded-2xl bg-kunyit-500 px-7 py-3.5 font-display font-bold text-hijau-900 transition-colors duration-200 hover:bg-kunyit-400"
            >
              Lihat syarat dan jadwal
            </Link>
            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border-2 border-hijau-100 px-7 py-3.5 font-display font-bold text-white transition-colors duration-200 hover:border-kunyit-300 hover:text-kunyit-300"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </BingkaiBalok>
    </section>
  );
}
