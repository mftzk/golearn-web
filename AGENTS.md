<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploying GoLearn

GoLearn runs on **Nrapken**. Two independent components:

- **golearn-web** (this repo) — the Next.js frontend, deployed as a Nrapken **quick app**. Nrapken builds the image from this Git repo (`mftzk/golearn-web`, branch `main`) and deploys it. This is what you deploy when you change lessons, pages, or UI.
- **golearn-runner** (separate repo `mftzk/golearn-runner`) — the Go sandbox that compiles+runs user code. A container **application**, not a quick app. You do NOT redeploy it for content/UI changes.

Key facts:
- Nrapken org slug: `first-1741110886`
- quick app slug: `golearn-web`
- Live URL: https://golearn-web.quick.nrapken.dev
- Auto-deploy is **on**: pushing to `main` automatically triggers a build + deploy.

## Content model (what you usually edit)

All lessons live in one file: **`content/chapters.ts`** — a single `chapters: Chapter[]` array. Adding/adjusting a lesson = editing this array; the chapter list (`app/chapters/page.tsx`) and detail page (`app/chapters/[slug]/page.tsx` via `generateStaticParams`) derive from it automatically. `order` is the display number and must stay sequential; prev/next follows array position.

Runnable panels execute in the **stdlib-only, no-network, unprivileged** runner. So `starterCode` must compile against the Go standard library only (no external modules, no cgo, no kernel/privileged APIs). Set `expectedOutput` only when output is deterministic; omit it for illustrative/machine-dependent programs.

## Deploy steps

1. Make your change, then verify locally:
   - `npx tsc --noEmit` must exit 0.
   - For any new/edited `starterCode`, copy it into a temp dir with a `go.mod` (`module sandbox` / `go 1.23`) and `go run .`; if `expectedOutput` is set, stdout must match it **exactly** (compared with `.trim()`).
2. Commit and `git push origin main`. Because auto-deploy is on, this alone triggers a build+deploy.
3. **Preferred when you have the Nrapken MCP**: trigger an explicit build so you can watch it:
   - `quick_apps_builds_create(organization="first-1741110886", quick_app="golearn-web", branch="main", deploy_after_build=true)`
   - Poll `quick_apps_builds_get(...)` until `status == "finished"` and `deployment_status == "running"`. On failure read `quick_apps_deployment_logs` / the build's `build_logs`.
   - Next.js gotcha: the pg pool must stay **lazy** (connect on first query, never at module load) or `next build` fails at "Collecting page data". `lib/db.ts` already does this — keep it that way.
4. Verify live (don't trust "deploy succeeded" alone):
   - `curl -s -o /dev/null -w "%{http_code}" https://golearn-web.quick.nrapken.dev/chapters` → 200
   - `curl` the specific page you changed and grep for the new text.

If you only have a shell (e.g. Codex without the Nrapken MCP): steps 1, 2, and 4 are enough — `git push origin main` deploys via auto-deploy, then verify with `curl`.
