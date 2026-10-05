#!/usr/bin/env node
/**
 * Sinkronisasi berita dari API Instagram.
 *
 * Yang dilakukan skrip ini:
 *   1. Mengambil data posting dari endpoint scraper.
 *   2. Mengunduh tiap thumbnail ke public/images/berita/ (asli, lalu dikonversi).
 *   3. Menulis data/berita.generated.ts agar halaman berita tidak
 *      bergantung pada API saat situs sudah tayang.
 *
 * Jalankan: npm run sync:berita
 *
 * CATATAN PENTING
 * Endpoint scraper di bawah mengembalikan data dari akun Instagram
 * resmi TK Taman Indria Jetis (@tamanindriajetis).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";

const run = promisify(execFile);

const ROOT = new URL("..", import.meta.url).pathname;
const ENDPOINT =
  process.env.BERITA_ENDPOINT ??
  "https://api-ig-ruddy.vercel.app/api/berita/sekolah/tamanindriajetis";
const OUT_GAMBAR = join(ROOT, "public/images/berita");
const OUT_DATA = join(ROOT, "data/berita.generated.ts");

/** Thumbnail Instagram hanya berlaku beberapa jam, jadi wajib dilokalkan. */
const MULAI = process.argv.includes("--mulai");

function bersihkanTeks(teks) {
  return teks
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu,
      "",
    )
    .replace(/\s*\n+\s*/g, "\n")
    .trim();
}

function slugDari(teks, id) {
  const dasar = teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${dasar || "berita"}-${String(id).slice(-6)}`;
}

function tanggalIndonesia(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { tanggal: "", iso: iso };
  return {
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d),
    iso: d.toISOString(),
  };
}

async function unduhDanOlah(url, namaFile) {
  const sementara = join(OUT_GAMBAR, `tmp-${namaFile}.asli`);
  const akhir = join(OUT_GAMBAR, namaFile);

  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} saat mengunduh`);
  await writeFile(sementara, Buffer.from(await res.arrayBuffer()));

  // Konversi ke webp lewat ImageMagick bila tersedia. Kalau tidak,
  // file asli tetap dipakai agar halaman tidak rusak.
  try {
    await run("magick", [sementara, "-strip", "-quality", "78", akhir]);
  } catch {
    await run("cp", [sementara, akhir]);
  }
  await run("rm", ["-f", sementara]);
  return `/images/berita/${namaFile}`;
}

async function main() {
  console.log("Mengambil data berita...");
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error(`Endpoint gagal: HTTP ${res.status}`);
  const json = await res.json();
  const items = Array.isArray(json) ? json : json.data;
  if (!Array.isArray(items)) throw new Error("Bentuk data tidak dikenali");

  await mkdir(OUT_GAMBAR, { recursive: true });

  const berita = [];
  let gagal = 0;

  for (const [index, item] of items.entries()) {
    const mentah = bersihkanTeks(item.caption ?? "");
    const baris = mentah.split("\n");
    const judul = (baris[0] || "Kegiatan Taman Indria").slice(0, 90);
    const paragraf = baris.slice(1).filter((b) => b.length > 12);
    const { tanggal, iso } = tanggalIndonesia(item.posted_at);
    const slug = slugDari(judul, item.id);
    const namaFile = `${slug}.webp`;

    let gambar = `/images/berita/${namaFile}`;
    const ada = existsSync(join(OUT_GAMBAR, namaFile));
    if (MULAI || !ada) {
      try {
        gambar = await unduhDanOlah(item.thumbnail_url, namaFile);
      } catch (e) {
        gagal++;
        console.log(`  lewati thumbnail ${slug}: ${e.message}`);
        gambar = "";
      }
    }

    berita.push({
      slug,
      judul,
      tanggal,
      tanggal: iso,
      ringkas: paragraf[0]?.slice(0, 160) ?? "",
      isi: paragraf,
      gambar,
      jenis: (function () {
        const tipe = String(item.type ?? "").toLowerCase();
        if (tipe === "video") return "Video";
        if (tipe === "carousel") return "Galeri";
        return "Foto";
      })(),
      tautan: item.post_url ?? "",
      jumlahSuka: item.likes ?? item.likes_count ?? 0,
      urutan: items.length - index,
    });
  }

  const isi = `/**
 * BERITA OTOMATIS - JANGAN DIEDIT TANGAN
 * ======================================
 *
 * File ini dibuat oleh \`npm run sync:berita\`.
 * Sumber: ${ENDPOINT}
 * Jumlah entri: ${berita.length}
 * Diperbarui: ${new Date().toISOString()}
 *
 * PERINGATAN: data berasal dari akun Instagram resmi
 * TK Taman Indria Jetis (@tamanindriajetis).
 */

export type Berita = {
  slug: string;
  judul: string;
  tanggal: string;
  tanggal: string;
  ringkas: string;
  isi: string[];
  gambar: string;
  jenis: "Foto" | "Video" | "Galeri";
  tautan: string;
  jumlahSuka: number;
  urutan: number;
};

export const berita: Berita[] = ${JSON.stringify(berita, null, 2)};

export const beritaTerbaru: Berita[] = [...berita].sort((a, b) =>
  b.tanggal.localeCompare(a.tanggal),
);
`;

  await writeFile(OUT_DATA, isi, "utf8");
  console.log(`\nSelesai. ${berita.length} berita ditulis, ${gagal} thumbnail gagal.`);
  console.log(`Data: ${OUT_DATA}`);
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
