import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Go — Sejarah & Cara Kerjanya | GoLearn",
  description:
    "Bagaimana bahasa Go dibuat, bagaimana ia bekerja, dan bagaimana Go berjalan di atas mesin — dengan sumber dari dokumentasi resmi go.dev.",
};

export default function TentangGoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-clay uppercase mb-3">
        Tentang bahasa
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink leading-tight">
        Tentang Go
      </h1>
      <p className="mt-5 text-lg text-muted leading-relaxed">
        Go (kadang disebut Golang) adalah bahasa pemrograman open source dari
        Google: <span className="text-ink">statically typed</span>,{" "}
        <span className="text-ink">dikompilasi ke kode mesin native</span>, dan
        punya <span className="text-ink">garbage collector</span> serta dukungan
        konkurensi bawaan. Halaman ini merangkum bagaimana Go dibuat, bagaimana
        ia bekerja, dan bagaimana ia berjalan di atas mesin — semuanya
        berdasarkan dokumentasi resmi.
      </p>

      {/* ── Sejarah ───────────────────────────────── */}
      <Section title="Bagaimana Go dibuat">
        <p>
          Go lahir dari rasa frustrasi terhadap bahasa yang dipakai di Google
          saat itu. Menurut FAQ resmi, seorang programmer harus memilih salah
          satu dari <em>“efficient compilation, efficient execution, or ease of
          programming”</em> — ketiganya tidak tersedia sekaligus dalam satu
          bahasa mainstream. Ditambah build C++ yang lambat dan naiknya CPU
          multicore yang menuntut dukungan konkurensi sebagai fitur kelas satu.
        </p>
        <p>
          Ketiga perancang awalnya — <strong>Robert Griesemer</strong>,{" "}
          <strong>Rob Pike</strong>, dan <strong>Ken Thompson</strong> — mulai
          menggambar tujuan bahasa ini di papan tulis pada{" "}
          <strong>21 September 2007</strong>.
        </p>

        <ol className="mt-6 space-y-4 border-l border-border pl-6">
          <TimelineItem date="21 Sep 2007">
            Griesemer, Pike, dan Thompson menyketsa tujuan bahasa baru.
          </TimelineItem>
          <TimelineItem date="Januari 2008">
            Ken Thompson mulai menggarap compiler pertama.
          </TimelineItem>
          <TimelineItem date="Akhir 2008">
            Russ Cox bergabung dan mendorong Go dari prototipe jadi kenyataan.
          </TimelineItem>
          <TimelineItem date="10 Nov 2009">
            Go dirilis sebagai proyek open source publik.
          </TimelineItem>
          <TimelineItem date="Maret 2012">
            Go 1.0 dirilis, disertai janji kompatibilitas untuk program Go 1.
          </TimelineItem>
        </ol>
      </Section>

      {/* ── Cara kerja bahasa ─────────────────────── */}
      <Section title="Bagaimana Go bekerja">
        <p>
          Tujuan desainnya, dalam kata-kata FAQ Go, adalah menggabungkan{" "}
          <em>“the ease of programming of an interpreted, dynamically typed
          language with the efficiency and safety of a statically typed,
          compiled language.”</em> Ciri-ciri utamanya:
        </p>
        <ul className="mt-4 space-y-3">
          <Feature label="Statically typed & compiled">
            Tipe diperiksa saat kompilasi, lalu program di-compile lebih dulu
            (ahead-of-time) menjadi kode mesin — bukan diinterpretasi saat
            jalan.
          </Feature>
          <Feature label="Kompilasi cepat">
            Membangun executable besar dirancang memakan “at most a few seconds”
            di satu komputer, menjawab keluhan build C++ yang lambat.
          </Feature>
          <Feature label="Garbage collected">
            Memori dikelola otomatis dengan garbage collector mark-and-sweep;
            optimasi bertahun-tahun menekan jeda GC sering ke rentang
            sub-milidetik walau heap besar.
          </Feature>
          <Feature label="Konkurensi bawaan (goroutine + channel)">
            Model konkurensinya berasal dari CSP (Communicating Sequential
            Processes-nya Tony Hoare). Goroutine sangat murah — hanya butuh
            memori stack beberapa kilobyte — sehingga praktis menjalankan ratusan
            ribu goroutine dalam satu address space, dan channel dipakai untuk
            komunikasi antar goroutine.
          </Feature>
        </ul>
      </Section>

      {/* ── Cara jalan di mesin ───────────────────── */}
      <Section title="Bagaimana Go berjalan di atas mesin">
        <p>
          Poin penting yang sering disalahpahami: <strong>Go tidak memakai
          virtual machine.</strong> FAQ menyatakan tegas{" "}
          <em>“Go&apos;s runtime does not include a virtual machine, such as is
          provided by the Java runtime.”</em> Program Go dikompilasi langsung ke
          kode mesin native.
        </p>
        <ul className="mt-4 space-y-3">
          <Feature label="Binary native & statically linked">
            Linker toolchain <code className="font-mono text-sm">gc</code>{" "}
            menghasilkan binary yang statically linked secara default. Setiap
            binary Go sudah menyertakan Go runtime di dalamnya, jadi bisa
            dijalankan tanpa dependensi eksternal.
          </Feature>
          <Feature label="Go runtime (bukan VM)">
            Setiap program membawa pustaka runtime yang, kata dokumentasi,
            <em> “analogous to libc”</em>: ia mengurus garbage collection,
            konkurensi, dan manajemen stack — tapi tetap kode native, bukan
            mesin virtual.
          </Feature>
          <Feature label="Scheduler goroutine (M:N)">
            Runtime me-multiplex banyak goroutine ke sekumpulan OS thread. Saat
            sebuah goroutine memblokir (mis. system call), runtime otomatis
            memindahkan goroutine lain di thread itu ke thread lain yang bisa
            jalan — “the programmer sees none of this.” Implementasinya di
            runtime dikenal sebagai model G–M–P (Goroutine, Machine/OS-thread,
            Processor).
          </Feature>
          <Feature label="Stack yang bisa berubah ukuran">
            Goroutine baru diberi stack beberapa kilobyte; saat kurang, runtime
            menumbuhkan (dan menyusutkan) stack itu otomatis — kunci kenapa
            banyak goroutine muat di memori yang sedikit.
          </Feature>
          <Feature label="Garbage collector konkuren">
            Di mesin multiprosesor, kolektor berjalan di core CPU terpisah,
            paralel dengan program utama.
          </Feature>
          <Feature label="Cross-compile lintas OS/arsitektur">
            Karena hasilnya binary native mandiri, kamu bisa mengompilasi untuk
            target lain (mis. Linux/ARM) dari satu mesin dengan mengatur{" "}
            <code className="font-mono text-sm">GOOS</code> dan{" "}
            <code className="font-mono text-sm">GOARCH</code>.
          </Feature>
        </ul>
      </Section>

      {/* ── Sumber ────────────────────────────────── */}
      <section className="mt-14 rounded-2xl border border-border bg-surface p-6 shadow-softer">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">
          Sumber
        </h2>
        <p className="text-sm text-muted mb-4">
          Fakta dan kutipan di halaman ini diambil dari dokumentasi resmi Go:
        </p>
        <ul className="space-y-2 text-sm">
          <SourceLink href="https://go.dev/doc/faq">
            Frequently Asked Questions (FAQ) — The Go Programming Language
          </SourceLink>
          <SourceLink href="https://go.dev/doc/go1">
            Go 1 Release Notes (rilis Maret 2012)
          </SourceLink>
          <SourceLink href="https://go.dev/doc/devel/release">
            Release History — The Go Programming Language
          </SourceLink>
          <SourceLink href="https://cs.opensource.google/go/go/+/master:src/runtime/proc.go">
            Kode sumber scheduler runtime Go (runtime/proc.go)
          </SourceLink>
        </ul>
      </section>

      <div className="mt-10 border-t border-border pt-6">
        <Link
          href="/chapters"
          className="text-sm text-clay hover:text-clay-hover transition-colors"
        >
          Mulai belajar Go bab per bab →
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink mb-4">
        {title}
      </h2>
      <div className="prose-lesson">{children}</div>
    </section>
  );
}

function TimelineItem({
  date,
  children,
}: {
  date: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative">
      <span className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-clay" />
      <span className="block text-sm font-medium text-clay">{date}</span>
      <span className="block text-ink">{children}</span>
    </li>
  );
}

function Feature({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <span className="block font-medium text-ink mb-1">{label}</span>
      <span className="block text-muted leading-relaxed">{children}</span>
    </li>
  );
}

function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-clay hover:text-clay-hover transition-colors break-words"
      >
        {children}
      </a>
    </li>
  );
}
