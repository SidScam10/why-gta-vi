# Authoring guide

Each article is one `.mdx` file in `content/articles/`. The file name becomes the URL: `content/articles/my-story.mdx` → `/articles/my-story/`.

## Run it locally

```bash
npm install          # first time only
npm run dev          # http://localhost:3000 — live reload while writing
npm run build        # static site in out/
npm run preview      # serves out/ at http://localhost:4173/why-gta-vi/, the way GitHub Pages will
```

## Start a new article

1. Copy `content/templates/starter.mdx` to `content/articles/<slug>.mdx`.
2. Fill in the frontmatter (the block between the `---` lines).
3. Write the body in Markdown and drop in components (see below).
4. Remove `draft: true` when it's ready to publish.

While only one article exists, `/` shows it directly. Once there are two or more, `/` becomes an index of story cards and "More stories" lists the others.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Big gradient headline |
| `kicker` | | Small caps line above the title |
| `deck` | | Summary under the title (also used for SEO and cards) |
| `byline`, `illustration`, `date`, `editor` | | Date format: `YYYY-MM-DD` |
| `hero.poster` | | Hero image. `hero.posterMobile` is an optional portrait crop for phones |
| `hero.video` | | Hero loop. Without an extension, both `.webm` and `.mp4` are tried |
| `thumb` | | Card image (falls back to `hero.poster`) |
| `theme` | | `accent`, `accent2`, `cream`, `bgFrom`, `bgTo`: colour overrides for this article only |
| `sources` | | List of `{ title, url, publisher?, date? }`. Shown as a numbered "Sources" section at the end, and hidden while empty |
| `draft` | | `true` hides the article from production builds |

## Chapters

```mdx
<Chapter title="THE SETUP" subtitle="Optional line" art="/img/ch1.jpg" />
```

You never number chapters or keep a list of them. At build time they're numbered automatically (01, 02…), given anchors (`#ch-1`…), and added to the menu and header. To insert a chapter, just add the tag where you want it. Add `id="my-anchor"` if you want a link that stays the same when chapters are reordered.

## Components

All image/video `src` values accept a local path (`/img/...`, a file in `public/`) **or** a full `https://` URL.

```mdx
<YouTube url="https://www.youtube.com/watch?v=XXXXXXXXXXX" title="Optional" caption="..." />
```
Accepts watch, youtu.be, shorts, embed links or a bare id. `?t=1m30s` sets a start time. The video loads only when clicked (privacy-enhanced domain). If `url` is empty, it shows a dashed "video slot" placeholder.

```mdx
<Figure src="..." alt="..." caption="..." credit="Photo: ..." />          {/* add `wide` to break out */}
<FigurePair a={{ src: "...", alt: "..." }} b={{ src: "...", alt: "..." }} caption="..." />
<FigureGrid images={[{ src, alt }, ...]} caption="..." />
<FullBleed src="..." alt="..." caption="..." parallax />
<Mosaic images={[{ src, alt, caption? }, ...]} columns={3} />            {/* tiles open a lightbox */}
<VideoLoop src="/video/clip" poster="/img/clip.jpg" caption="..." wide />  {/* muted, plays in view */}
<PullQuote cite="Name">Short punchy line.</PullQuote>
<StickyScene>
  <Step src="..." alt="...">Text for this step.</Step>
</StickyScene>
```

`alt` is required on meaningful images. Use `alt=""` only for purely decorative ones.

## Media

- Put files in `public/img/<slug>/` and `public/video/<slug>/` so each article's media stays together.
- Images: export about 2400px wide for full-bleed, 1600px for inset. Prefer `.avif`/`.webp`/`.jpg`.
- Loops: 6–15 s, no audio, 720p, 1–4 MB each:
  ```bash
  ffmpeg -i in.mov -an -vf scale=-2:720 -c:v libvpx-vp9 -crf 34 -b:v 0 clip.webm
  ffmpeg -i in.mov -an -vf scale=-2:720 -c:v libx264 -crf 26 -preset veryfast -movflags +faststart clip.mp4
  ```
- Anything long or with sound: upload to YouTube and use `<YouTube>`.
- GitHub Pages limits: site ≤ 1 GB, no file over 100 MB, Git LFS not supported.
- Add every third-party asset to `src/app/credits/page.tsx`.
- `public/img/placeholder/` and `public/video/placeholder-loop.*` are generated stand-ins (`node scripts/make-placeholders.mjs`) and can be deleted once real media is in.

## Site-wide settings

- Site name and "coming soon" related cards: `src/site.config.ts`
- Colours, column width, spacing: tokens at the top of `src/app/globals.css`
- Fonts: `src/app/fonts.ts`
- Adding a new MDX component: build it in `src/components/`, then register it in `src/mdx-components.tsx`
- Repo name / basePath: `REPO` in `next.config.mjs` (set to `''` for a custom domain, and add `public/CNAME`)

## Publishing (when you're ready)

1. Push to `main` on GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
