# Workspace

## Overview

pnpm workspace monorepo — "Kun Fayakun" Islamic Dhikr & Dua gamified app. Full-stack TypeScript.

## App Features
- **Progressive Dhikr Counter** — 12 dhikr with levels (Beginner/Intermediate/Advanced), meanings, rewards, Arabic + transliteration
- **Prayer Tracker** — Daily log with quality (Excellent=Star, Good=ThumbsUp, Rushed=Zap, Distracted=Brain — all Lucide SVG icons, no emojis), dhikr done (Check/X icons), time prayed input; weekly/monthly stats; calendar view; SlideUpPanel is z-[60] above nav bar
- **How to Pray** — Interactive 9-step Salah guide with Arabic text, minimalist design (no emoji)
- **Duas (Library)** — 33 dua categories with Main/Other sub-tabs + Islamic Stories; heading says "Duas"; all icons are Lucide SVG components mapped from string keys via ICON_MAP
- **Stats Dashboard** — Three-tab layout (Dhikr/Salah/Quran): Dhikr tab shows total tasbeehat, streaks, milestones, videos watched, achievements; Salah tab shows completed/missed/rate/post-dhikr stats with daily breakdown bars and streak; Quran tab shows reading progress, juz completion ring, pages read, and Quran-specific achievements
- **Quran Tracker** — Reading log by surah/ayah/pages + Memorisation tracker with strength ratings
- **Qibla Compass** — Clean, simple redesign: auto-requests geolocation on mount (no button needed), location bar at top showing city name or status, responsive compass (max 288px, scales to 75vw on small screens) with tick marks (every 5°/45°/90°), N/S/E/W labels, gold triangle needle with Kaaba SVG icon at tip pointing toward Mecca, info card showing bearing degrees; error state shows browser-specific instructions (Chrome/Safari/Firefox); manual heading slider fallback when no compass; z-[60] overlay
- **Islamic Quiz** — Unlocked by dhikr milestones, 12 questions
- **Theme Customisation** — 6 color presets (Sage Green default, Royal Purple, Ocean Blue, Rose, Dark Forest, Warm Sand)
- **Color Scheme** — Green background (HSL 135 30% 88%), forest green primary (HSL 150 45% 28%), gold secondary/borders (HSL 43 72% 52%), beige cards (HSL 40 30% 93%); all borders are gold-tinted; frosted-card, gold-border-rounded, glass-panel custom utilities
- **Language** — 8 language options (English, Arabic, Urdu, French, Turkish, Bahasa Melayu, Bahasa Indonesia, Bengali) stored in localStorage
- **Accessibility** — Font size (Normal/Large/Extra Large), High Contrast mode, Always Show Arabic toggle
- **App Icon** — Two Holy Mosques SVG icon (`HolyMosquesIcon.tsx`) used on Welcome page and branding
- **Prayer Time Icons** — Sun stage SVGs (`SunStageIcon.tsx`) showing sun position for each prayer (dawn/sunrise/noon/afternoon/sunset/night) instead of prayer position stick figures
- **User accounts** — Replit Auth (OIDC/PKCE), guest mode, or email sign-in; per-user data isolation in all DB tables
- **Prayer Times** — Location-based adhan times with 12 calculation methods (MWL, Egyptian, Karachi, UmmAlQura, Dubai, etc.) + Asr method (Shafi/Hanafi), ±5 min per-prayer offsets, SunArc SVG, individual card-box layout with prayer position SVGs
- **Sun Arc** — SVG animation showing sun/moon position between Fajr and Isha
- **Push Notifications** — Service Worker (public/sw.js) scheduling prayer time browser notifications
- **Home Page** — AppLogoIcon + "Kun Fayakun" title centered at top; Auth banner (Sign In / Guest); quick-access icon bar (Qibla, Quran, Stats, Quiz, Guide); Quick Duas grid, Islamic Videos promo card, Featured Dhikr card; no framer-motion (CSS transitions only)
- **Videos Page** — 31 curated Islamic YouTube videos in 6 categories with YouTube thumbnails (fallback to colored initials), embedded YouTube player via youtube-nocookie.com + "Open on YouTube" button, watch progress tracking (localStorage), global progress ring (X/31 watched), vertical scroll layout
- **Prayer Position SVGs** — 5 prayer positions (Qiyam/Ruku/Sujud/Jalsah/Tasleem) as transparent SVG figures that fill with golden light progressively as prayers are completed
- **Auth Flow** — No separate login/welcome page; Home loads directly with auth banner at top if user hasn't chosen; CompactAuthPrompt in header after choice made
- **HalalTok** — TikTok-style vertical swipe learning feed at `/halaltok`; 30 full-screen cards with Islamic reminders, hadith, Quran verses, tips, duas, and facts; CSS scroll-snap for native swipe feel; dark gradient backgrounds per card; each card has a unique SVG clip art illustration (book, quran, moon, hands, shield, heart, star, compass, scroll, lantern, crescent, mosque, seed, water, scale, tree, sun, mountain, honey, pen); multi-paragraph detailed content; like/save/share action buttons; progress counter (1/30); likes and saves persisted in localStorage; center nav button with raised gold gradient pill
- **Prayer Time Settings** — dedicated page at `/prayer-settings` with 4 tabs: Location (shows GPS coords, privacy info), Calculation (method dropdown + Madhab/Asr + High Latitude Rule + Jumu'ah offset from Dhuhr with +/- 5min buttons), Adjustments (±min per-prayer fine-tuning for all 6 prayers), Timetable (today's times + weekly Mosque Timetable grid with editable time inputs stored in localStorage); accessible from Settings page via a "Prayer Time Settings" card link; has back button (sub-page)
- **Bottom Navigation** — Home, Dhikr, Prayers, HalalTok (center, raised gold button), Library, Videos, Settings (7 items) with custom illustrative clip-art SVG icons (NavIcons.tsx), beige/gold when inactive, forest green when active; sticky back button appears inside scrollable area for sub-pages (/qibla, /quiz, /quran, /stats, /more, /library/duas/*, /library/stories/*); safe-area-inset-bottom padding for mobile
- **Icons** — Bottom nav uses custom clip-art SVGs (NavIcons.tsx); all other icons are Lucide SVG icons (no emoji); icon names stored as strings in data, rendered via ICON_MAP in Library.tsx
- **Expo Mobile App** — Full React Native app at artifacts/dhikr-mobile: Home, Dhikr, Prayers, Quran, Settings tabs; NativeTabs with liquid glass on iOS 26+; adhan library for prayer times; Amiri Arabic font; AsyncStorage persistence; haptic feedback

## Dua Categories (33 total)
- **Main tab (15)**: Ummah, Morning, Evening, Before Sleep, Tahajjud, Salah, After Salah, Ruqyah & Illness, Praises of Allah, Salawat, Quranic Duas, Sunnah Duas, Istighfar, Dhikr for All Times, Names of Allah
- **Other tab (18)**: Waking Up, Nightmares, Clothes, Lavatory & Wudu, Food & Drink, Home, Adhan & Masjid, Istikharah, Gatherings, Difficulties & Happiness, Protection of Iman, Hajj & Umrah, Travel, Money & Shopping, Social Interactions, Marriage & Children, Death, Nature

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
