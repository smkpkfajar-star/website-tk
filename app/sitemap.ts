import type { MetadataRoute } from "next";
import { nav } from "@/data/site";
import { berita } from "@/data/berita.generated";
import { site } from "@/data/site";

/**
 * Sitemap
 * =======
 *
 * Daftar tautan yang boleh diindeks. Hanya halaman statis yang
 * masuk. Halaman berita ikut diambil dari data hasil sinkronisasi
 * Instagram, jadi setiap posting baru otomatis masuk sitemap.
 *
 * CATATAN: `site.url` masih placeholder. Sitemap tidak boleh dipakai
 * sebelum domain resmi diganti di `data/site.ts`.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const halamanUtama = nav
    .map((item) => item.href)
    .filter((href) => href !== "/");

  const statis: MetadataRoute.Sitemap = halamanUtama.map((href) => ({
    url: `${site.url}${href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.7,
  }));

  const beritaBaru: MetadataRoute.Sitemap = berita.map((b) => ({
    url: `${site.url}/berita/${b.slug}`,
    lastModified: new Date(b.tanggal),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...statis,
    ...beritaBaru,
  ];
}
