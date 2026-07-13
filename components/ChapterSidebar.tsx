import Link from "next/link";
import { chapters, type ChapterSection } from "@/content/chapters";

export default function ChapterSidebar({
  currentSlug,
  completedSlugs,
  sections,
}: {
  currentSlug: string;
  completedSlugs: Set<string>;
  sections: ChapterSection[];
}) {
  return (
    <nav aria-label="Daftar bab dan subbab">
      <ol className="space-y-1">
        {chapters.map((c) => {
          const active = c.slug === currentSlug;
          const done = completedSlugs.has(c.slug);
          return (
            <li key={c.slug}>
              <Link
                href={`/chapters/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-clay-soft text-ink font-medium"
                    : "text-muted hover:bg-surface-alt hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    done
                      ? "bg-clay text-white"
                      : active
                        ? "bg-clay/15 text-clay"
                        : "bg-surface-alt text-muted"
                  }`}
                >
                  {done ? "✓" : c.order}
                </span>
                <span className="leading-snug">{c.title}</span>
              </Link>
              {active && sections.length > 0 && (
                <ol
                  aria-label={`Subbab ${c.title}`}
                  className="ml-9 mt-1 space-y-0.5 border-l border-border pl-3"
                >
                  {sections.map((section) => (
                    <li key={section.id}>
                      <Link
                        href={`/chapters/${c.slug}#${section.id}`}
                        className="block rounded-md px-2 py-1.5 text-xs leading-snug text-muted transition-colors hover:bg-surface-alt hover:text-ink"
                      >
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
