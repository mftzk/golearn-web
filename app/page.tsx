import Link from "next/link";
import { chapters } from "@/content/chapters";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
        <p className="text-sm font-medium tracking-wide text-clay uppercase mb-4">
          Belajar sambil praktik
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-ink max-w-2xl">
          Belajar bahasa Go, langsung nulis dan jalanin kodenya di browser.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">
          {chapters.length} bab, dari <span className="text-ink">Halo, Go</span> sampai{" "}
          <span className="text-ink">eBPF</span>. Setiap bab punya console
          interaktif — tulis kode Go asli, jalankan sungguhan, lihat hasilnya.
          Progress belajarmu tersimpan otomatis.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/chapters"
            className="rounded-full bg-clay px-6 py-3 text-white font-medium hover:bg-clay-hover transition-colors shadow-softer"
          >
            Mulai belajar
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-border px-6 py-3 text-ink font-medium hover:bg-surface-alt transition-colors"
          >
            Buat akun gratis
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Console sungguhan"
            body="Kode Go yang kamu tulis benar-benar di-compile dan dijalankan di sandbox, bukan simulasi."
          />
          <FeatureCard
            title="Bab per bab"
            body="Materi tersusun bertahap — dari sintaks dasar dan konkurensi sampai topik lanjutan seperti eBPF."
          />
          <FeatureCard
            title="Progress tersimpan"
            body="Masuk dengan akun, dan progress belajarmu tersimpan lintas perangkat."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-softer">
      <h3 className="font-display text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
