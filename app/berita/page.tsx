import type { Metadata } from "next";
import { KartuBerita } from "@/components/kartu-berita";
import { KepalaHalaman } from "@/components/kepala-halaman";
import { KontenSementara } from "@/components/konten-sementara";
import { getBerita } from "@/data/berita.generated";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Berita Sekolah",
  description: `Dokumentasi kegiatan dan kabar terbaru ${site.nama}, disinkronkan dari Instagram sekolah.`,
  alternates: { canonical: `${site.url}/berita` },
};

export default async function HalamanBerita() {
  const berita = await getBerita().catch(() => []);

  return (
    <>
      <KepalaHalaman
        label="Berita"
        judul="Catatan kegiatan sekolah"
        deskripsi="Dokumentasi harian dan kabar terbaru dari akun resmi sekolah."
      />
      <KontenSementara>
        {berita.length === 0 ? (
          <section className="mx-auto max-w-6xl px-4 py-20">
            <p className="text-ink-soft">Belum ada berita yang dipublikasikan.</p>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-4 py-20">
            <p className="text-sm text-ink-soft">
              {berita.length} berita tersimpan.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {berita.map((b) => (
                <KartuBerita key={b.slug} b={b} judulLevel="h2" />
              ))}
            </div>
          </section>
        )}
      </KontenSementara>
    </>
  );
}