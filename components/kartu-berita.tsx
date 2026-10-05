import Image from "next/image";
import Link from "next/link";
import type { Berita } from "@/data/berita.generated";

export function KartuBerita({
  b,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  alt = "",
  judulLevel: Tag = "h3",
}: {
  b: Berita;
  sizes?: string;
  alt?: string;
  judulLevel?: "h2" | "h3";
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Thumbnail Gambar / Video Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        {b.gambar ? (
          <Image
            src={b.gambar}
            alt={alt || b.alt || b.judul}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge Kategori */}
        <span className="absolute top-3 left-3 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
          {b.kategori}
        </span>

        {/* Indicator Video jika berita berisi video */}
        {b.isVideo && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Video
          </span>
        )}
      </div>

      {/* Konten Berita */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Tanggal */}
          <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            <time dateTime={b.tanggal}>{b.tanggalLabel}</time>
          </p>

          {/* Judul Berita */}
          <Tag className="mt-2 font-semibold text-slate-900 transition-colors group-hover:text-emerald-600">
            <Link href={`/berita/${b.slug}`} className="line-clamp-2 focus:outline-none">
              {b.judul}
            </Link>
          </Tag>

          {/* Ringkasan */}
          {b.ringkasan && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {b.ringkasan}
            </p>
          )}
        </div>

        {/* Footer Kartu (Selengkapnya / Likes) */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
          <Link
            href={`/berita/${b.slug}`}
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
          >
            Baca selengkapnya
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          {b.likes > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              ❤️ {b.likes}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}